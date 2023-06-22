import {
  Exercise,
  LoggerFactory,
  Page,
  Service,
  User,
  Workout,
  WorkoutExercise
} from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ProgressMetric, Unit } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../prisma.service';
import {
  EditProgressMetricDTO,
  GetProgressMetricsQueryDTO,
  ProgressMetricDTO
} from './dto';
import { UserProgress } from './dto/user-progress';

const logger = LoggerFactory('progress-service');

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
    const workoutService = await firstValueFrom(
      this.httpService.get<Service>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/name/workout`
      )
    );

    const {
      data: { METValue }
    } = await firstValueFrom(
      this.httpService.get<Exercise>(
        `${process.env.WORKOUT_SERVICE_URL}/exercises/${exerciseId}`,
        {
          headers: { 'api-key': workoutService.data.apiKey }
        }
      )
    );

    const userService = await firstValueFrom(
      this.httpService.get<Service>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/name/user`
      )
    );

    logger.info('Getting bodyweight...');
    const {
      data: { bodyWeight }
    } = await firstValueFrom(
      this.httpService.get<User>(
        `${process.env.USER_SERVICE_URL}/users/${userId}`,
        {
          headers: { 'api-key': userService.data.apiKey }
        }
      )
    );
    return Math.round((METValue * 3.5 * bodyWeight) / (200 * 60)) * timeSpent;
  }

  async createProgressMetric(data: ProgressMetricDTO): Promise<ProgressMetric> {
    const burntCalories = await this.burntCalories(
      data.exerciseId,
      data.timeSpent,
      data.userId
    );

    const metricData = { burntCalories, ...data };
    console.log(metricData);

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

  async editProgressMetric(
    id: number,
    data: EditProgressMetricDTO
  ): Promise<ProgressMetric | null> {
    const burntCalories = await this.burntCalories(
      data.exerciseId,
      data.timeSpent,
      data.userId
    );

    return this.prisma.progressMetric.update({
      where: {
        id
      },
      data: {
        ...data,
        burntCalories
      }
    });
  }

  deleteProgressMetric(id: number): Promise<ProgressMetric | null> {
    return this.prisma.progressMetric.delete({
      where: {
        id
      }
    });
  }

  async completeWorkout(
    workoutId: string,
    userId: number
  ): Promise<ProgressMetric[]> {
    logger.info('Getting workout...');

    const {
      data: { apiKey }
    } = await firstValueFrom(
      this.httpService.get<Service>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/name/workout`
      )
    );

    const workout = await firstValueFrom(
      this.httpService.get<Workout>(
        `${process.env.WORKOUT_SERVICE_URL}/workouts/${workoutId}`,
        {
          headers: { 'api-key': apiKey }
        }
      )
    );

    const progressMetrics: ProgressMetric[] = [];
    const exercises = workout.data.exercises;

    for (const exercise of exercises) {
      const unit = exercise.unit.toString();

      const prismaUnit =
        unit === 'KILOGRAMS'
          ? Unit.KILOGRAMS
          : unit === 'METERS'
          ? Unit.METERS
          : unit === 'SECONDS'
          ? Unit.SECONDS
          : Unit.REPETITIONS;

      const updatedMetric = await this.updateMetricWithSameExercise(
        exercise,
        userId,
        prismaUnit
      );
      if (updatedMetric) {
        logger.info('Metric has been updated');
        progressMetrics.push(updatedMetric);
        continue;
      }

      logger.info('Creating progress metric');
      logger.info('repDuration: ', exercise.repDuration);
      const duration = exercise.repDuration ?? 1;
      const metric = await this.createProgressMetric({
        timeSpent:  duration * exercise.sets * exercise.reps,
        value:      exercise.reps * exercise.sets,
        unit:       prismaUnit,
        exerciseId: exercise.exerciseId,
        userId
      });
      progressMetrics.push(metric);
    }
    return progressMetrics;
  }

  async updateMetricWithSameExercise(
    exercise: WorkoutExercise,
    userId: number,
    unit: Unit
  ): Promise<ProgressMetric | null> {
    const metric = await this.prisma.progressMetric.findUnique({
      where: {
        exerciseId_userId: {
          exerciseId: exercise.exerciseId,
          userId
        }
      }
    });

    if (!metric) {
      return null;
    }

    return this.editProgressMetric(metric.id, {
      timeSpent:
        exercise.repDuration * exercise.sets * exercise.reps + metric.timeSpent,
      value:      exercise.reps * exercise.sets + metric.value,
      unit:       unit,
      exerciseId: exercise.exerciseId,
      userId
    });
  }

  async getUserProgress(
    userId: number,
    dates: GetProgressMetricsQueryDTO
  ): Promise<UserProgress> {
    const filter = { ...dates, userId };
    const metrics = await this.findAndCount({
      ...filter
    });

    const exercisesSet = new Set<string>();
    metrics.rows.forEach(metric => {
      exercisesSet.add(metric.exerciseId); // unique ids
    });

    const activityTypes = await this.getExerciseCategories(
      Array.from(exercisesSet)
    );

    const traveledDistance = metrics.rows
      .filter(metric => metric.unit === Unit.METERS)
      .reduce((actual, total) => actual + total.value, 0);

    const timeSpent = metrics.rows.reduce(
      (actual, total) => actual + total.timeSpent,
      0
    );

    const burntCalories = metrics.rows.reduce(
      (actual, total) => actual + total.burntCalories,
      0
    );

    logger.debug('User progress: ', {
      traveledDistance,
      timeSpent:     Math.round(timeSpent / 60), // in minutes
      burntCalories: Math.round(burntCalories),
      activityTypes
    });

    return {
      traveledDistance,
      timeSpent:     Math.round(timeSpent / 60), // in minutes
      burntCalories: Math.round(burntCalories),
      activityTypes
    };
  }

  async getExerciseCategories(
    exerciseIds: string[]
  ): Promise<{ [category: number]: number }> {
    logger.info('Exercises ids: ', exerciseIds);

    const {
      data: { apiKey }
    } = await firstValueFrom(
      this.httpService.get<Service>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/name/workout`
      )
    );

    const exercises = await firstValueFrom(
      this.httpService.get<Exercise[]>(
        `${process.env.WORKOUT_SERVICE_URL}/exercises`,
        {
          params:  { filters: JSON.stringify({ _id: exerciseIds }) },
          headers: { 'api-key': apiKey }
        }
      )
    );

    logger.info('Exercises number: ', exercises.data.length);

    const categoryCounts: { [category: number]: number } = {};

    exercises.data.forEach(exercise => {
      if (categoryCounts[exercise.category]) {
        categoryCounts[exercise.category]++;
      }
      categoryCounts[exercise.category] = 1;
    });

    logger.info('Hash of categories: ', categoryCounts);
    return categoryCounts;
  }
}
