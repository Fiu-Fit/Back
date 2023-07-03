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
    value:      80,
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

  describe('create', () => {
    it('should create a Progress Metric', async () => {
      const updatedAt = new Date();
      prisma.progressMetric.create.mockResolvedValueOnce({
        ...defaultProgressMetric,
        updatedAt
      });

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
});
