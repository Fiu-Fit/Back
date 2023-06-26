import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { RatingService } from '../ratings/rating.service';
import { WorkoutDto } from './dto/workout.dto';
import { Workout } from './schemas/workout.schema';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name)
    private workoutModel: Model<Workout>,
    private ratingService: RatingService
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

  async updateWorkout(
    id: string,
    workout: Partial<WorkoutDto>
  ): Promise<Workout> {
    const updatedWorkout = await this.workoutModel.findByIdAndUpdate(
      { _id: id },
      workout,
      { new: true }
    );
    if (!updatedWorkout) {
      throw new NotFoundException('Exercise not found');
    }
    return updatedWorkout;
  }
}
