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
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { Twilio } from 'twilio';
import { firebaseApp } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { AdminRegisterRequest, LoginRequest, RegisterRequest } from './dto';
import { Token } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService
  ) {}

  async register(
    newUser: RegisterRequest | AdminRegisterRequest
  ): Promise<Token> {
    const auth = getAuth(firebaseApp);
    let userCredentials: UserCredential;
    let token: string = '';

    try {
      userCredentials = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      const { password, ...userData } = newUser;

      const confirmationPIN = this.generateConfirmationPIN();
      await this.prismaService.user.create({
        data: {
          ...userData,
          uid: userCredentials.user.uid,
          confirmationPIN
        }
      });

      if (userData.phoneNumber) {
        await this.sendWhatsappNotification(
          confirmationPIN,
          userData.phoneNumber
        );
      }

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

  async login(loginInfo: LoginRequest): Promise<Token> {
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

    if (!user.confirmed && user.phoneNumber && !user.confirmationPIN) {
      const confirmationPIN = this.generateConfirmationPIN();
      await this.sendWhatsappNotification(confirmationPIN, user.phoneNumber);

      await this.userService.editUser(user.id, { confirmationPIN });
    }

    await this.updateLoginTime(user.id);

    return { token };
  }

  async adminLogin(loginInfo: LoginRequest): Promise<Token> {
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

  async resetPassword(email: string): Promise<UserActivity> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new BadRequestException('Invalid email');

    const auth = getAuth(firebaseApp);
    sendPasswordResetEmail(auth, email);

    return this.prismaService.userActivity.create({
      data: {
        userId:    user.id,
        type:      UserActivityType.PasswordReset,
        createdAt: new Date()
      }
    });
  }

  sendWhatsappNotification(confirmationPIN: string, phoneNumber: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = new Twilio(accountSid, authToken);

    client.messages
      .create({
        body: `Tu codigo de confirmacion es: ${confirmationPIN}`,
        from: 'whatsapp:+14155238886',
        to:   'whatsapp:' + phoneNumber
      })
      .then((message: { sid: any }) => console.log(message.sid));

    console.log('Whatsapp notification sent succesfully!');
  }

  generateConfirmationPIN() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async confirmRegistration(
    userId: number,
    confirmationPIN: string
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);

    if (!user) throw new BadRequestException('Usuario no existe');

    if (user.confirmed) throw new BadRequestException('Usuario ya confirmado');

    if (user.confirmationPIN !== confirmationPIN)
      throw new BadRequestException('Codigo de confirmacion incorrecto');

    await this.userService.editUser(userId, { confirmed: true });
  }
}
