import { Unit } from '.prisma/client';
import { HttpModule, HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, ProgressMetric } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { of } from 'rxjs';
import { PrismaService } from '../../../prisma.service';
import { ProgressMetricDTO } from '../dto';
import { ProgressService } from '../progress.service';

describe('ProgressService', () => {
  let progressService: ProgressService;
  let prisma: DeepMockProxy<PrismaClient>;
  let httpService: DeepMockProxy<HttpService>;

  const newProgressMetric: ProgressMetricDTO = {
    timeSpent:  100,
    value:      100,
    unit:       Unit.REPETITIONS,
    exerciseId: '64a1f222926f9054816becbd',
    userId:     1
  };

  const defaultProgressMetric: Omit<ProgressMetric, 'createdAt'> = {
    ...newProgressMetric,
    id:            1,
    burntCalories: 100,
    updatedAt:     new Date()
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:   [HttpModule],
      providers: [ProgressService, PrismaService]
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    progressService = await module.resolve(ProgressService);
    prisma = await module.resolve(PrismaService);
    httpService = await module.resolve(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(progressService).toBeDefined();
    expect(prisma).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('burntCalories', () => {
    it('Should return burnt calories', async () => {
      const burntCalories = 18.7;
      const workoutServiceResponse: any = {
        data:       { apiKey: 'workoutApiKey' },
        status:     200,
        statusText: 'OK'
      };

      const exerciseResponse: any = {
        data:       { METValue: 8 },
        status:     200,
        statusText: 'OK'
      };

      const userServiceResponse: any = {
        data:       { apiKey: 'userApiKey' },
        status:     200,
        statusText: 'OK'
      };

      const userResponse: any = {
        data:       { bodyWeight: 80 },
        status:     200,
        statusText: 'OK'
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(workoutServiceResponse))
        .mockImplementationOnce(() => of(exerciseResponse))
        .mockImplementationOnce(() => of(userServiceResponse))
        .mockImplementationOnce(() => of(userResponse));

      const result = await progressService.burntCalories(
        '64a1f222926f9054816becbd',
        100,
        1
      );
      expect(result).toEqual(burntCalories);
    });
  });

  describe('create', () => {
    it('should create a Progress Metric', async () => {
      const updatedAt = new Date();
      prisma.progressMetric.create.mockResolvedValueOnce({
        ...defaultProgressMetric,
        updatedAt
      });

      jest
        .spyOn(progressService, 'burntCalories')
        .mockImplementation(_ => Promise.resolve(100));

      const result = await progressService.createProgressMetric(
        newProgressMetric
      );

      expect(result).toStrictEqual({
        ...defaultProgressMetric,
        updatedAt
      });
    });
  });

  describe('find', () => {
    async function assertFind(metrics: ProgressMetric[]) {
      const page = {
        rows:  metrics,
        count: metrics.length
      };

      prisma.progressMetric.findMany.mockResolvedValueOnce(metrics);
      prisma.progressMetric.count.mockResolvedValueOnce(metrics.length);

      const result = await progressService.findAndCount({});

      expect(result).toStrictEqual(page);
    }

    it('should find all progress metrics', () => {
      const progressMetrics = [
        defaultProgressMetric,
        {
          ...defaultProgressMetric,
          id: 2
        }
      ];
      assertFind(progressMetrics);
    });

    it('Empty array doesnt throw error', () => {
      const progress: ProgressMetric[] = [];

      assertFind(progress);
    });
  });

  describe('findById', () => {
    it('Should return Progress with given ID', async () => {
      const progressMetric: ProgressMetric = {
        ...defaultProgressMetric
      };

      prisma.progressMetric.findUnique.mockResolvedValueOnce(progressMetric);

      const result = await progressService.getProgressMetricById(
        progressMetric.id
      );

      expect(result).toStrictEqual(progressMetric);
    });

    it('should throw error if not found', async () => {
      const id = 1;

      prisma.progressMetric.findUnique.mockResolvedValueOnce(null);

      await expect(progressService.getProgressMetricById(id)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateById', () => {
    it('Should update Progress metric', async () => {
      const progress: ProgressMetric = {
        ...defaultProgressMetric
      };

      const editedMetric: ProgressMetric = {
        id:            1,
        timeSpent:     120,
        value:         80,
        unit:          Unit.REPETITIONS,
        burntCalories: 100,
        updatedAt:     new Date(),
        userId:        1,
        exerciseId:    '64a1f222926f9054816becbd'
      };

      prisma.progressMetric.update.mockResolvedValueOnce(editedMetric);

      const result = await progressService.editProgressMetric(
        progress.id,
        editedMetric
      );

      expect(result).toStrictEqual(editedMetric);
    });
  });

  describe('deleteById', () => {
    it('Should delete Progress metric', async () => {
      const metric: ProgressMetric = {
        ...defaultProgressMetric
      };

      const id = 1;

      prisma.progressMetric.delete.mockResolvedValueOnce(metric);

      const response: any = {
        data:       { apiKey: '123' },
        status:     200,
        statusText: 'OK'
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      jest
        .spyOn(httpService, 'delete')
        .mockImplementationOnce(() => of(response));

      const result = await progressService.deleteProgressMetric(id);

      expect(result).toStrictEqual(metric);
    });
  });

  // describe('updateMetricWithSameExercise', () => {
  //   it('Should update Progress metric', async () => {
  //     const metric: ProgressMetric = {
  //       ...defaultProgressMetric
  //     };

  //     const editedMetric: ProgressMetric = {
  //       id:            1,
  //       timeSpent:     120,
  //       value:         100,
  //       unit:          Unit.REPETITIONS,
  //       burntCalories: 140,
  //       updatedAt:     new Date(),
  //       userId:        1,
  //       exerciseId:    '64a1f222926f9054816becbd'
  //     };

  //     prisma.progressMetric.findUnique.mockResolvedValueOnce(metric);

  //     const result = await progressService.updateMetricWithSameExercise(
  //       {
  //         exerciseId:  '64a1f222926f9054816becbd',
  //         sets:        1,
  //         reps:        20,
  //         unit:        Unit.REPETITIONS,
  //         repDuration: 1
  //       },
  //       1,
  //       Unit.REPETITIONS
  //     );

  //     expect(result).toEqual(editedMetric);

  //   });
  // });

  describe('completeWorkout', () => {
    it('Should create many Progress Metrics', async () => {
      const progressMetrics = [
        defaultProgressMetric,
        {
          ...defaultProgressMetric,
          id: 2
        }
      ];

      const workout = {
        _id:         'workoutId',
        name:        'test',
        description: 'test',
        duration:    30,
        difficulty:  5,
        category:    3,
        exercises:   [
          {
            exerciseId:  '64a1f222926f9054816becbd',
            sets:        1,
            reps:        100,
            unit:        Unit.REPETITIONS,
            repDuration: 1
          },
          {
            exerciseId:  '64a1f222926f9054816becbf',
            sets:        1,
            reps:        100,
            unit:        Unit.REPETITIONS,
            repDuration: 1
          }
        ],
        athleteIds: [],
        authorId:   3,
        multimedia: []
      };

      const response: any = {
        data:       { apiKey: '123' },
        status:     200,
        statusText: 'OK'
      };

      const workoutResponse: any = {
        data:       workout,
        status:     200,
        statusText: 'OK'
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(response))
        .mockImplementation(() => of(workoutResponse));

      prisma.progressMetric.findUnique.mockResolvedValueOnce(null);
      jest
        .spyOn(progressService, 'burntCalories')
        .mockImplementation(_ => Promise.resolve(100));

      for (const metric of progressMetrics) {
        prisma.progressMetric.create.mockResolvedValueOnce(metric);
      }

      const result = await progressService.completeWorkout('workoutId', 1);

      expect(result).toEqual(progressMetrics);
    });
  });

  describe('getUserProgress', () => {
    it('should return user progress without any filters', async () => {
      const progressMetrics = [
        defaultProgressMetric,
        {
          ...defaultProgressMetric,
          id: 2
        }
      ];

      const userProgress = {
        traveledDistance:  0,
        timeSpent:         3.3, // in minutes
        burntCalories:     200,
        numberOfExercises: 2
      };

      prisma.progressMetric.findMany.mockResolvedValueOnce(progressMetrics);
      prisma.progressMetric.count.mockResolvedValueOnce(progressMetrics.length);

      const result = await progressService.getUserProgress(1, {});

      expect(result).toEqual(userProgress);
    });

    it('should return user progress with filtered category', async () => {
      const progressMetrics = [
        defaultProgressMetric,
        {
          ...defaultProgressMetric,
          id:         2,
          exerciseId: '1',
          updatedAt:  new Date('2021-05-01')
        },
        {
          ...defaultProgressMetric,
          id:         3,
          exerciseId: '2'
        }
      ];

      const userProgress = {
        traveledDistance:  0,
        timeSpent:         3.3, // in minutes
        burntCalories:     200,
        numberOfExercises: 2
      };

      prisma.progressMetric.findMany.mockResolvedValueOnce(progressMetrics);
      prisma.progressMetric.count.mockResolvedValueOnce(progressMetrics.length);

      jest
        .spyOn(progressService, 'getFilteredExerciseIds')
        .mockImplementation(() => Promise.resolve(['1', '2']));

      const result = await progressService.getUserProgress(1, { category: 3 });
      expect(result).toEqual(userProgress);
    });
  });
});
