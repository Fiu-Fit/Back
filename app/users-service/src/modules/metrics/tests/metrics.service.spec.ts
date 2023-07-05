import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaClient,
  RequestStatus,
  Role,
  User,
  UserActivityType
} from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../../prisma.service';
import { UserDTO } from '../../user/dto';
import { MetricsService } from '../metrics.service';

const authMock = {
  deleteUser:    jest.fn(),
  verifyIdToken: jest.fn(
    _ =>
      ({
        email: 'default'
      } as any)
  )
};

jest.mock('firebase-admin', () => {
  return {
    auth:          jest.fn(() => authMock),
    initializeApp: jest.fn().mockReturnThis(),
    credential:    {
      cert: jest.fn().mockReturnThis()
    }
  };
});

describe('MetricsService', () => {
  let prisma: DeepMockProxy<PrismaClient>;
  let metricsService: MetricsService;

  const expectToBeCalledWithByMonth = (
    model: keyof typeof prisma,
    where: any,
    year: number
  ) => {
    const modelMock = prisma[model] as any;

    for (let i = 0; i < 12; i++) {
      expect(modelMock.count).toHaveBeenNthCalledWith(i + 1, {
        where: {
          ...where,
          createdAt: {
            gte: new Date(year, i),
            lt:  new Date(year, i + 1)
          }
        }
      });
    }
  };

  const newUser: UserDTO = {
    firstName:      'test',
    lastName:       'test',
    email:          'test@gmail.com',
    role:           Role.Admin,
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
      providers: [PrismaService, MetricsService]
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    metricsService = await module.resolve(MetricsService);

    prisma = await module.resolve(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(metricsService).toBeDefined();
  });

  describe('countByMonth', () => {
    it('should count users by month', async () => {
      prisma.user.count.mockResolvedValue(1);
      const year = 2023;

      const result = await metricsService.countByMonth({}, 'user', year);

      expect(result).toEqual(Array(12).fill(1));
      expect(prisma.user.count).toBeCalledTimes(12);
      expectToBeCalledWithByMonth('user', {}, year);
    });
  });

  describe('getRegisterMetrics', () => {
    it('should count registered users by month', async () => {
      prisma.user.count.mockResolvedValue(1);
      const where = {
        federatedIdentity: false,
        blocked:           false
      };
      const year = 2023;

      const result = await metricsService.getRegisterMetrics({
        ...where,
        year
      });

      expect(result).toEqual(Array(12).fill(1));
      expect(prisma.user.count).toHaveBeenCalledTimes(12);
      expectToBeCalledWithByMonth('user', where, year);
    });
  });

  describe('getLoginMetrics', () => {
    it('should count login activities by month', async () => {
      prisma.userActivity.count.mockResolvedValue(2);
      const where = {
        federatedIdentity: false,
        blocked:           true
      };
      const year = 2022;

      const result = await metricsService.getLoginMetrics({
        ...where,
        year
      });

      expect(result).toEqual(Array(12).fill(2));
      expect(prisma.userActivity.count).toHaveBeenCalledTimes(12);
      expectToBeCalledWithByMonth(
        'userActivity',
        {
          type: UserActivityType.Login,
          user: where
        },
        year
      );
    });
  });

  describe('getPasswordResetMetrics', () => {
    it('should count password reset activities by month', async () => {
      prisma.userActivity.count.mockResolvedValue(3);
      const where = {
        federatedIdentity: true,
        blocked:           false
      };
      const year = 2021;

      const result = await metricsService.getPasswordResetMetrics({
        ...where,
        year
      });

      expect(result).toEqual(Array(12).fill(3));
      expect(prisma.userActivity.count).toHaveBeenCalledTimes(12);
      expectToBeCalledWithByMonth(
        'userActivity',
        {
          type: UserActivityType.PasswordReset,
          user: where
        },
        year
      );
    });
  });

  describe('createLoginMetrics', () => {
    it('should create a login metric', async () => {
      const userMetric = {
        id:        1,
        createdAt: new Date(),
        type:      UserActivityType.Login,
        userId:    1
      };
      prisma.userActivity.create.mockResolvedValueOnce(userMetric);
      prisma.user.findUnique.mockResolvedValueOnce(defaultUser);

      const result = await metricsService.createLoginMetric('testUserId');

      expect(result).toEqual(userMetric);
      expect(prisma.userActivity.create).toHaveBeenCalledWith({
        data: {
          type:   userMetric.type,
          userId: userMetric.userId
        }
      });
    });

    it('should throw an error if the user does not exist', () => {
      const userMetric = {
        id:        1,
        createdAt: new Date(),
        type:      UserActivityType.Login,
        userId:    1
      };
      prisma.userActivity.create.mockResolvedValueOnce(userMetric);
      prisma.user.findUnique.mockResolvedValueOnce(null);

      expect(
        metricsService.createLoginMetric('testUserId')
      ).rejects.toThrowError(new UnauthorizedException('Usuario no existe'));
    });
  });

  describe('getTrainerMetrics', () => {
    it('should return the number of verified and unverified trainers', async () => {
      prisma.user.count.mockResolvedValueOnce(10);
      prisma.verification.count.mockResolvedValueOnce(4);
      const filter = {
        federatedIdentity: false,
        blocked:           true
      };

      const result = await metricsService.getTrainerMetrics(filter);

      expect(result).toEqual({
        verifiedTrainers:   4,
        unverifiedTrainers: 6
      });
      expect(prisma.user.count).toHaveBeenCalledWith({
        where: {
          ...filter,
          role: Role.Trainer
        }
      });
      expect(prisma.verification.count).toHaveBeenCalledWith({
        where: {
          status: RequestStatus.Approved,
          user:   {
            role: Role.Trainer,
            ...filter
          }
        }
      });
    });
  });

  describe('getBlockedUsersMetrics', () => {
    it('should return the number of blocked users per month', async () => {
      prisma.user.count.mockResolvedValue(10);
      const filters = {
        federatedIdentity: true,
        year:              2020
      };

      const result = await metricsService.getBlockedUsersMetrics(filters);

      expect(result).toEqual(Array(12).fill(10));
      expect(prisma.user.count).toHaveBeenCalledTimes(12);
      for (let i = 0; i < 12; i++) {
        expect(prisma.user.count).toHaveBeenNthCalledWith(i + 1, {
          where: {
            blocked:           true,
            federatedIdentity: filters.federatedIdentity,
            blockedAt:         {
              gte: new Date(filters.year, i),
              lt:  new Date(filters.year, i + 1)
            }
          }
        });
      }
    });
  });
});
