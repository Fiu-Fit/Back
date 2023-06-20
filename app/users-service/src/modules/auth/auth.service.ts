import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Role, UserActivity, UserActivityType } from '@prisma/client';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { firebaseApp } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { AdminRegisterRequest, LoginRequest, RegisterRequest } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService
  ) {}

  async register(
    newUser: RegisterRequest | AdminRegisterRequest
  ): Promise<{ token: string }> {
    const auth = getAuth(firebaseApp);
    let userCredentials: UserCredential;
    let token: string;

    try {
      userCredentials = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      const { password, ...userData } = newUser;
      await this.prismaService.user.create({
        data: {
          ...userData,
          uid: userCredentials.user.uid
        }
      });

      token = await userCredentials.user.getIdToken();
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new ConflictException({
            message: `Email already in use: ${error}`
          });
        case 'auth/invalid-email':
          throw new BadRequestException({ message: `Invalid email: ${error}` });
        case 'auth/weak-password':
          throw new BadRequestException({ message: `Weak password: ${error}` });
        default:
          throw new BadRequestException({
            message: `Error while registering: ${error}`
          });
      }
    }

    return { token };
  }

  async login(loginInfo: LoginRequest): Promise<{ token: string }> {
    const token = await this.getUserToken(loginInfo);
    const user = await this.userService.getUserByToken(token);

    if (!user || user.role === Role.Admin) {
      throw new UnauthorizedException({
        message: 'Invalid Credentials'
      });
    }

    if (user.blocked) {
      throw new UnauthorizedException({
        message: 'User is blocked'
      });
    }

    await this.updateLoginTime(user.id);

    return { token };
  }

  async adminLogin(loginInfo: LoginRequest): Promise<{ token: string }> {
    const token = await this.getUserToken(loginInfo);
    const user = await this.userService.getUserByToken(token);

    if (!user || user.role !== Role.Admin) {
      throw new UnauthorizedException({
        message: 'Invalid credentials: You are not an admin'
      });
    }

    if (user.blocked) {
      throw new UnauthorizedException({
        message: 'Admin user is blocked'
      });
    }

    await this.updateLoginTime(user.id);

    return { token };
  }

  async logout(): Promise<void> {
    const auth = getAuth(firebaseApp);
    try {
      await signOut(auth);
    } catch (error) {
      throw new BadRequestException({
        message: `Error while logging out: ${error}`
      });
    }
  }

  async updateLoginTime(userId: number): Promise<void> {
    await this.prismaService.userActivity.create({
      data: {
        userId,
        type:      UserActivityType.Login,
        createdAt: new Date()
      }
    });
  }

  async getUserToken(loginInfo: LoginRequest): Promise<string> {
    const auth = getAuth(firebaseApp);
    let userCredentials: UserCredential;
    let token: string;
    try {
      userCredentials = await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password
      );
      token = await userCredentials.user.getIdToken();
    } catch (error) {
      throw new BadRequestException({
        message: 'Invalid Credentials'
      });
    }

    return token;
  }

  async addPasswordReset(token: string): Promise<UserActivity> {
    const user = await this.userService.getUserByToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');

    return this.prismaService.userActivity.create({
      data: {
        userId:    user.id,
        type:      UserActivityType.PasswordReset,
        createdAt: new Date()
      }
    });
  }
}
