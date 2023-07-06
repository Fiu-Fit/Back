import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityType } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { MetricsController } from '../metrics.controller';
import { MetricsService } from '../metrics.service';

describe('MetricsController', () => {
  let metricsService: MetricsService;
  let metricsController: MetricsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers:   [MetricsService, PrismaService]
    }).compile();

    metricsService = await module.resolve(MetricsService);
    metricsController = await module.resolve(MetricsController);
  });

  it('should be defined', () => {
    expect(metricsService).toBeDefined();
    expect(metricsController).toBeDefined();
  });

  describe('getLoginMetrics', () => {
    it('should count login activities per month', async () => {
      jest
        .spyOn(metricsService, 'getLoginMetrics')
        .mockResolvedValue(Array(12).fill(1));
      const filter = {
        year:              2023,
        federatedIdentity: false,
        blocked:           false
      };

      const result = await metricsController.getLoginMetrics(filter);

      expect(metricsService.getLoginMetrics).toHaveBeenCalledWith(filter);
      expect(result).toEqual(Array(12).fill(1));
    });
  });

  describe('getRegisterMetrics', () => {
    it('should count registered users per month', async () => {
      jest
        .spyOn(metricsService, 'getRegisterMetrics')
        .mockResolvedValue(Array(12).fill(2));
      const filter = {
        year:              2022,
        federatedIdentity: true,
        blocked:           true
      };

      const result = await metricsController.getRegisterMetrics(filter);

      expect(metricsService.getRegisterMetrics).toHaveBeenCalledWith(filter);
      expect(result).toEqual(Array(12).fill(2));
    });
  });

  describe('getPasswordResetMetrics', () => {
    it('should count password reset activities per month', async () => {
      jest
        .spyOn(metricsService, 'getPasswordResetMetrics')
        .mockResolvedValue(Array(12).fill(3));
      const filter = {
        year:              2021,
        federatedIdentity: true,
        blocked:           false
      };

      const result = await metricsController.getPasswordResetMetrics(filter);

      expect(metricsService.getPasswordResetMetrics).toHaveBeenCalledWith(
        filter
      );
      expect(result).toEqual(Array(12).fill(3));
    });
  });

  describe('getUsersMetrics', () => {
    it('should count password reset activities per month', async () => {
      const userMetrics = {
        Athlete: 5,
        Trainer: 4,
        Admin:   2
      };

      jest
        .spyOn(metricsService, 'getUsersMetrics')
        .mockResolvedValue(userMetrics);
      const filter = {
        year:              2021,
        federatedIdentity: true,
        blocked:           false
      };

      const result = await metricsController.getUsersMetrics(filter);

      expect(metricsService.getUsersMetrics).toHaveBeenCalledWith(filter);
      expect(result).toEqual(userMetrics);
    });
  });

  describe('createLoginMetrics', () => {
    it('should create a login user activity', async () => {
      const loginActivity = {
        id:        1,
        type:      UserActivityType.Login,
        userId:    1,
        createdAt: new Date()
      };
      jest
        .spyOn(metricsService, 'createLoginMetric')
        .mockResolvedValue(loginActivity);

      const result = await metricsController.createLoginMetric('aTestUserId');

      expect(metricsService.createLoginMetric).toHaveBeenCalledWith(
        'aTestUserId'
      );
      expect(result).toEqual(loginActivity);
    });
  });

  describe('getTrainerMetrics', () => {
    it('should create a login user activity', async () => {
      const trainerMetrics = {
        verifiedTrainers:   2,
        unverifiedTrainers: 5
      };
      const filter = {
        year:              2021,
        federatedIdentity: true,
        blocked:           false
      };

      jest
        .spyOn(metricsService, 'getTrainerMetrics')
        .mockResolvedValue(trainerMetrics);

      const result = await metricsController.getTrainerMetrics(filter);

      expect(metricsService.getTrainerMetrics).toHaveBeenCalledWith(filter);
      expect(result).toEqual(trainerMetrics);
    });
  });

  describe('getBlockedUsersMetrics', () => {
    it('should create a login user activity', async () => {
      const filter = {
        year:              2021,
        federatedIdentity: true,
        blocked:           false
      };

      jest
        .spyOn(metricsService, 'getBlockedUsersMetrics')
        .mockResolvedValue(Array(12).fill(3));

      const result = await metricsController.getBlockedUsersMetrics(filter);

      expect(metricsService.getBlockedUsersMetrics).toHaveBeenCalledWith(
        filter
      );
      expect(result).toEqual(Array(12).fill(3));
    });
  });
});
