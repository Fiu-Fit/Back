import { Unit } from '.prisma/client';
import { Page } from '@fiu-fit/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Goal, GoalStatus, PrismaClient, ProgressMetric } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { of } from 'rxjs';
import { PrismaService } from '../../../prisma.service';
import { ProgressService } from '../../progress/progress.service';
import { GoalDto } from '../dto/goal.dto';
import { GoalService } from '../goal.service';

describe('GoalService', () => {
  let goalService: GoalService;
  let progressService: ProgressService;
  let prisma: DeepMockProxy<PrismaClient>;
  let httpService: DeepMockProxy<HttpService>;

  const newGoal: GoalDto = {
    title:       'Flexiones de brazos',
    description: 'Flexiones de brazos',
    userId:      1,
    targetValue: 50,
    deadline:    new Date(),
    exerciseId:  'test'
  };

  const defaultGoal: Omit<Goal, 'createdAt'> = {
    ...newGoal,
    id:         1,
    status:     GoalStatus.InProgress,
    multimedia: []
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:   [HttpModule],
      providers: [GoalService, PrismaService, ProgressService]
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    goalService = await module.resolve(GoalService);
    prisma = await module.resolve(PrismaService);
    progressService = await module.resolve(ProgressService);
    httpService = await module.resolve(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(goalService).toBeDefined();
    expect(progressService).toBeDefined();
    expect(prisma).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('create', () => {
    it('should create a Goal', async () => {
      const createdAt = new Date();
      prisma.goal.create.mockResolvedValueOnce({
        ...defaultGoal,
        createdAt
      });

      const result = await goalService.createGoal(newGoal);

      expect(result).toStrictEqual({
        ...defaultGoal,
        createdAt
      });
    });
  });

  describe('find', () => {
    it('should find all Goals', async () => {
      const goals = [
        {
          id:          1,
          title:       'Flexiones de brazos',
          description: 'Flexiones de brazos',
          status:      GoalStatus.InProgress,
          targetValue: 50,
          deadline:    new Date(),
          createdAt:   new Date(),
          userId:      1,
          exerciseId:  'test',
          multimedia:  []
        },
        {
          id:          2,
          title:       'Abdominales',
          description: 'Abdominales',
          status:      GoalStatus.InProgress,
          targetValue: 50,
          deadline:    new Date(),
          createdAt:   new Date(),
          userId:      1,
          exerciseId:  'test',
          multimedia:  []
        }
      ];

      prisma.goal.findMany.mockResolvedValueOnce(goals);

      const result = await goalService.findAll({});

      expect(result).toStrictEqual(goals);
    });

    it('Empty array doesnt throw error', async () => {
      const goals: Goal[] = [];
      prisma.goal.findMany.mockResolvedValueOnce(goals);

      const result = await goalService.findAll({});

      expect(result).toStrictEqual(goals);
    });
  });

  describe('findById', () => {
    it('Should return Goal with ID', async () => {
      const goal: Goal = {
        ...defaultGoal,
        createdAt: new Date()
      };

      prisma.goal.findUnique.mockResolvedValueOnce(goal);

      const result = await goalService.getGoalById(goal.id);

      expect(result).toStrictEqual(goal);
    });

    it('should throw error if not found', async () => {
      const id = 1;

      prisma.goal.findUnique.mockResolvedValueOnce(null);

      await expect(goalService.getGoalById(id)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateById', () => {
    it('Should update Goal', async () => {
      const goal: Goal = {
        ...defaultGoal,
        createdAt: new Date()
      };

      const editedGoal: Goal = {
        id:          1,
        title:       'Abdominales',
        description: 'Abdominales',
        status:      GoalStatus.InProgress,
        targetValue: 100,
        deadline:    new Date(),
        createdAt:   new Date(),
        userId:      1,
        exerciseId:  '5t432',
        multimedia:  []
      };

      prisma.goal.update.mockResolvedValueOnce(editedGoal);

      const result = await goalService.editGoal(goal.id, editedGoal);

      expect(result).toStrictEqual(editedGoal);
    });
  });

  describe('deleteById', () => {
    it('Should delete Goal', async () => {
      const goal: Goal = {
        ...defaultGoal,
        createdAt: new Date()
      };

      const id = 1;

      prisma.goal.delete.mockResolvedValueOnce(goal);

      const response: any = {
        data:       { apiKey: '123' },
        status:     200,
        statusText: 'OK'
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      jest
        .spyOn(httpService, 'delete')
        .mockImplementationOnce(() => of(response));

      const result = await goalService.deleteGoal(id);

      expect(result).toStrictEqual(goal);
    });
  });

  describe('checkGoalStatus', () => {
    const metrics: Page<ProgressMetric> = {
      count: 2,
      rows:  [
        {
          id:            1,
          burntCalories: 100,
          timeSpent:     100,
          value:         25,
          unit:          Unit.KILOGRAMS,
          exerciseId:    'test',
          userId:        1,
          updatedAt:     new Date()
        },
        {
          id:            2,
          burntCalories: 100,
          timeSpent:     100,
          value:         25,
          unit:          Unit.KILOGRAMS,
          exerciseId:    'test',
          userId:        1,
          updatedAt:     new Date()
        }
      ]
    };

    beforeAll(() => {
      jest
        .spyOn(progressService, 'findAndCount')
        .mockImplementation(_ => Promise.resolve(metrics));

      jest
        .spyOn(goalService, 'completeGoal')
        .mockImplementation((goal, status) =>
          Promise.resolve({ ...goal, status })
        );
    });

    it('Should return the same goal when its completed', async () => {
      const goal: Goal = {
        ...defaultGoal,
        createdAt: new Date(),
        status:    GoalStatus.Completed
      };

      const result = await goalService.checkGoalStatus(goal);

      expect(result).toStrictEqual(goal);
    });

    it('Should return the same goal when its completed late', async () => {
      const goal: Goal = {
        ...defaultGoal,
        createdAt: new Date(),
        status:    GoalStatus.CompletedLate
      };

      const result = await goalService.checkGoalStatus(goal);

      expect(result).toStrictEqual(goal);
    });

    it('Should return the same goal when user doesnt complete the goal', async () => {
      const goal: Goal = {
        ...defaultGoal,
        createdAt:   new Date(),
        status:      GoalStatus.InProgress,
        targetValue: 200
      };

      const result = await goalService.checkGoalStatus(goal);

      expect(result).toStrictEqual(goal);
    });

    it('Should complete goal when user meets requirements', async () => {
      const goal: Goal = {
        ...defaultGoal,
        deadline:    new Date('2024-01-01'),
        createdAt:   new Date(),
        status:      GoalStatus.InProgress,
        targetValue: 50
      };

      const completedGoal: Goal = {
        ...goal,
        status: GoalStatus.Completed
      };

      const result = await goalService.checkGoalStatus(goal);

      expect(result).toStrictEqual(completedGoal);
    });

    it('Should complete goal late when user meets requirements', async () => {
      const goal: Goal = {
        ...defaultGoal,
        createdAt:   new Date(),
        status:      GoalStatus.InProgress,
        targetValue: 50,
        deadline:    new Date('2021-01-01')
      };

      const completedGoal: Goal = {
        ...goal,
        status: GoalStatus.CompletedLate
      };

      const result = await goalService.checkGoalStatus(goal);

      expect(result).toStrictEqual(completedGoal);
    });
  });
});
