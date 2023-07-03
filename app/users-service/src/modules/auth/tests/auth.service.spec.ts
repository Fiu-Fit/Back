import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Role, User, UserActivityType } from '@prisma/client';
import { sendPasswordResetEmail } from 'firebase/auth';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Model } from 'mongoose';
import { PrismaService } from '../../../prisma.service';
import { UserDTO } from '../../user/dto';
import { UserService } from '../../user/user.service';
import { UserLocation } from '../../user-location/schema/user-location.schema';
import { UserLocationService } from '../../user-location/user-location.service';
import { AuthService } from '../auth.service';
import { LoginRequest, RegisterRequest } from '../dto';

const TOKEN = 'token';

jest.mock('firebase/auth', () => {
  return {
    createUserWithEmailAndPassword: jest.fn(() => ({
      user: {
        uid:        'test',
        getIdToken: jest.fn(() => TOKEN)
      }
    })),
    getAuth: jest.fn(() => ({
      deleteUser:    jest.fn(),
      verifyIdToken: jest.fn(
        _ =>
          ({
            email: 'default'
          } as any)
      )
    })),
    signOut:                    jest.fn(),
    signInWithEmailAndPassword: jest.fn(() => ({
      user: {
        getIdToken: jest.fn(() => TOKEN)
      }
    })),
    sendPasswordResetEmail: jest.fn()
  };
});
describe('UserService', () => {
  let authService: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;
  let userService: UserService;

  const newUser: UserDTO = {
    firstName:      'test',
    lastName:       'test',
    email:          'test@gmail.com',
    role:           Role.Trainer,
    bodyWeight:     100,
    interests:      [],
    phoneNumber:    '',
    uid:            'test',
    profilePicture: 'test',
    deviceToken:    'test'
  };

  const defaultUser: User = {
    ...newUser,
    id:                1,
    createdAt:         new Date(),
    confirmationPIN:   '',
    confirmed:         false,
    blocked:           false,
    blockedAt:         null,
    federatedIdentity: false
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:   [HttpModule],
      providers: [
        UserService,
        PrismaService,
        AuthService,
        UserLocationService,
        {
          provide:  getModelToken(UserLocation.name),
          useValue: Model
        }
      ]
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userService = await module.resolve(UserService);

    prisma = await module.resolve(PrismaService);

    authService = await module.resolve(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(userService).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const register: RegisterRequest = {
        firstName:   'test',
        lastName:    'test',
        email:       'test@gmail.com',
        password:    'test123',
        role:        Role.Admin,
        bodyWeight:  100,
        phoneNumber: ''
      };

      const result = await authService.register(register);

      expect(result).toStrictEqual({ token: TOKEN });
    });
  });

  describe('login', () => {
    it('should login a new user', async () => {
      const login: LoginRequest = {
        email:    'test@gmail.com',
        password: 'test123'
      };

      jest.spyOn(authService, 'getUserToken').mockResolvedValueOnce(TOKEN);

      jest
        .spyOn(userService, 'getUserByToken')
        .mockResolvedValueOnce(defaultUser);

      const result = await authService.login(login);

      expect(result).toStrictEqual({ token: TOKEN });
    });
  });

  describe('adminLogin', () => {
    it('should login a new admin', async () => {
      const login: LoginRequest = {
        email:    'test@gmail.com',
        password: 'test123'
      };

      jest.spyOn(authService, 'getUserToken').mockResolvedValueOnce(TOKEN);

      jest
        .spyOn(userService, 'getUserByToken')
        .mockResolvedValueOnce({ ...defaultUser, role: Role.Admin });

      const result = await authService.adminLogin(login);

      expect(result).toStrictEqual({ token: TOKEN });
    });
  });

  describe('logout', () => {
    it('should logout current user', async () => {
      await authService.logout();
    });
  });

  describe('getUserToken', () => {
    it('should getUserToken', async () => {
      const userId = 1;
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

      await authService.updateLoginTime(userId);

      expect(prisma.userActivity.create).toBeCalledWith({
        data: {
          userId,
          type:      UserActivityType.Login,
          createdAt: new Date()
        }
      });
    });
  });

  describe('getUserToken', () => {
    it('should updateLogin Time', async () => {
      const login: LoginRequest = {
        email:    'test@gmail.com',
        password: 'test123'
      };

      const result = await authService.getUserToken(login);
      expect(result).toStrictEqual(TOKEN);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const email = 'test@gmail.com';

      jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValueOnce(defaultUser);

      const createdActivity = {
        id:        1,
        userId:    defaultUser.id,
        type:      UserActivityType.PasswordReset,
        createdAt: new Date()
      };

      prisma.userActivity.create.mockResolvedValueOnce(createdActivity);

      const result = await authService.resetPassword(email);

      expect(sendPasswordResetEmail).toBeCalledTimes(1);
      expect(result).toStrictEqual(createdActivity);
    });
  });

  describe('generateConfirmationPIN', () => {
    it('should generate confirmation pin', () => {
      const result = authService.generateConfirmationPIN();

      expect(parseInt(result)).toBeLessThanOrEqual(999999);
    });
  });

  describe('confirmRegistration', () => {
    it('should confirm registration', async () => {
      const pin = '123456';

      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce({
        ...defaultUser,
        location:        undefined,
        confirmationPIN: pin
      });

      jest.spyOn(userService, 'editUser').mockResolvedValueOnce({
        ...defaultUser,
        confirmationPIN: pin,
        confirmed:       true
      });

      const result = await authService.confirmRegistration(defaultUser.id, pin);

      expect(result).toBeUndefined();

      expect(userService.editUser).toBeCalledWith(defaultUser.id, {
        confirmed: true
      });
    });
  });
});
