import { Exercise, Page, User } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ProgressMetric } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../prisma.service';
import {
  EditProgressMetricDTO,
  GetProgressMetricsQueryDTO,
  ProgressMetricDTO
} from './dto';

@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async burntCalories(
    exerciseId: string,
    timeSpent: number,
    userId: number
  ): Promise<number> {
    const {
      data: { METValue }
    } = await firstValueFrom(
      this.httpService.get<Exercise>(
        `${process.env.WORKOUT_SERVICE_URL}/exercises/${exerciseId}`,
        {
          headers: { 'api-key': process.env.WORKOUT_API_KEY }
        }
      )
    );

    const {
      data: { bodyWeight }
    } = await firstValueFrom(
      this.httpService.get<User>(
        `${process.env.USER_SERVICE_URL}/users/${userId}`,
        {
          headers: { 'api-key': process.env.USER_API_KEY }
        }
      )
    );
    return ((METValue * 3.5 * bodyWeight) / (200 * 60)) * timeSpent;
  }

  async createProgressMetric(data: ProgressMetricDTO): Promise<ProgressMetric> {
    const burntCalories = await this.burntCalories(
      data.exerciseId,
      data.timeSpent,
      data.userId
    );

    const metricData = { ...data, timeSpent: undefined, burntCalories };

    return this.prisma.progressMetric.create({
      data: metricData
    });
  }

  async findAndCount(
    filter: GetProgressMetricsQueryDTO
  ): Promise<Page<ProgressMetric>> {
    const filters = {
      updatedAt: {
        gte: filter.start,
        lte: filter.end
      },
      exerciseId: filter.exerciseId,
      userId:     filter.userId
    };

    return {
      rows: await this.prisma.progressMetric.findMany({
        orderBy: { id: 'asc' },
        where:   filters
      }),
      count: await this.prisma.progressMetric.count({
        orderBy: { id: 'asc' },
        where:   filters
      })
    };
  }

  getProgressMetricById(id: number): Promise<ProgressMetric | null> {
    return this.prisma.progressMetric.findUnique({
      where: {
        id
      }
    });
  }

  editProgressMetric(
    id: number,
    data: EditProgressMetricDTO
  ): Promise<ProgressMetric | null> {
    return this.prisma.progressMetric.update({
      where: {
        id
      },
      data
    });
  }

  deleteProgressMetric(id: number): Promise<ProgressMetric | null> {
    return this.prisma.progressMetric.delete({
      where: {
        id
      }
    });
  }
}
