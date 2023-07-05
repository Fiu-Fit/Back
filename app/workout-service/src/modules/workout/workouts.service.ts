import {
  Page,
  RatingCount,
  Service,
  User,
  WorkoutMetric
} from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { RatingService } from '../ratings/rating.service';
import { EditWorkoutDto, WorkoutMetricsFilterDto } from './dto';
import { WorkoutDto } from './dto/workout.dto';
import { Workout } from './schemas/workout.schema';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name)
    private workoutModel: Model<Workout>,
    private ratingService: RatingService,
    private httpService: HttpService
  ) {}

  createWorkout(newWorkout: WorkoutDto): Promise<Workout> {
    return this.workoutModel.create(newWorkout);
  }

  getWorkouts(
    q?: string,
    filters?: Record<
      string,
      string | number | [number, number] | { $gte: number; $lte: number }
    >
  ): Promise<Workout[]> {
    if (filters?.difficulty && Array.isArray(filters.difficulty)) {
      const [lower, upper] = filters.difficulty;
      filters.difficulty = { $gte: lower, $lte: upper };
    }

    return this.workoutModel.find({
      ...(q ? { $text: { $search: q, $caseSensitive: false } } : {}),
      ...filters
    });
  }

  async getWorkoutById(id: string): Promise<Workout> {
    const [workout] = await this.workoutModel.aggregate<Workout>([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: { path: '$exercises', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from:         'exercises',
          localField:   'exercises.exerciseId',
          foreignField: '_id',
          as:           'exercises.exercise'
        }
      },
      {
        $unwind: {
          path:                       '$exercises.exercise',
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $group: {
          _id:       '$_id',
          exercises: {
            $push: '$exercises'
          }
        }
      },
      {
        $lookup: {
          from:         'workouts',
          localField:   '_id',
          foreignField: '_id',
          as:           'workoutDetails'
        }
      },
      {
        $unwind: {
          path:                       '$workoutDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          'workoutDetails.exercises': '$exercises'
        }
      },
      {
        $replaceRoot: {
          newRoot: '$workoutDetails'
        }
      }
    ]);

    if (!workout) {
      throw new NotFoundException('El plan de entrenamiento no existe');
    }

    return {
      ...workout,
      exercises: workout.exercises.filter(
        exercise => Object.keys(exercise).length > 0
      ),
      averageRating: await this.ratingService.getAverageRating(id)
    };
  }

  async deleteWorkout(id: string): Promise<Workout> {
    const workout = await this.workoutModel.findByIdAndDelete({ _id: id });
    if (!workout) {
      throw new NotFoundException('Workout not found');
    }
    return workout;
  }

  async updateWorkout(id: string, workout: EditWorkoutDto): Promise<Workout> {
    console.log(workout);
    const updatedWorkout = await this.workoutModel.findByIdAndUpdate(
      { _id: id },
      { $set: workout },
      { new: true }
    );
    if (!updatedWorkout) {
      throw new NotFoundException('Exercise not found');
    }
    return updatedWorkout;
  }

  isFutureDate(date: Date, currentDate: Date): boolean {
    return (
      date.getFullYear() > currentDate.getFullYear() ||
      (date.getFullYear() == currentDate.getFullYear() &&
        date.getMonth() > currentDate.getMonth() + 1)
    );
  }

  async getWorkoutMetrics(
    id: string,
    filters: WorkoutMetricsFilterDto
  ): Promise<WorkoutMetric[]> {
    const workout = await this.workoutModel.findById(id);
    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    const {
      data: { apiKey }
    } = await firstValueFrom(
      this.httpService.get<Service>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/name/user`
      )
    );

    const { data: favoritedBy } = await firstValueFrom(
      this.httpService.get<Array<Page<User>>>(
        `${process.env.USERS_SERVICE_URL}/users/favorited/${id}`,
        {
          headers: { 'api-key': apiKey },
          params:  filters
        }
      )
    );

    const year = filters.year || new Date().getFullYear();
    const ratings: RatingCount[][] = [];
    const averageRatings: number[] = [];
    const favoritedByCount = favoritedBy.map(page => page.count);
    const endDate = new Date(year, 1, 1);
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      if (this.isFutureDate(endDate, currentDate)) {
        break;
      }

      const rating = await this.ratingService.getRatingCountPerValue(
        id,
        undefined,
        endDate
      );
      const averageRating = await this.ratingService.getAverageRating(
        id,
        undefined,
        endDate
      );

      ratings.push(rating);
      averageRatings.push(averageRating);

      endDate.setMonth(endDate.getMonth() + 1);
    }

    const ratingsPadding = Array(12 - ratings.length).fill(
      Array(5).fill({ rating: 0, count: 0 })
    );
    const averageRatingsPadding = Array(12 - averageRatings.length).fill(0);

    const ratingsWithPadding = ratings.concat(ratingsPadding);
    const averageRatingsWithPadding = averageRatings.concat(
      averageRatingsPadding
    );

    const metrics = favoritedByCount.map((count, index) => {
      return {
        ratings:       ratingsWithPadding[index],
        averageRating: averageRatingsWithPadding[index],
        favoriteCount: count
      };
    });

    return metrics;
  }
}
