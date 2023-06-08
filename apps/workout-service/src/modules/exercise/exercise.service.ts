import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExerciseDto } from './dto/exercise.dto';
import { Exercise } from './schemas/exercise.schema';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>
  ) {}

  createExercise(exercise: ExerciseDto): Promise<Exercise> {
    return this.exerciseModel.create(exercise);
  }

  getExercises(
    q?: string,
    parsedFilters?: Record<string, string>
  ): Promise<Exercise[]> {
    return this.exerciseModel.find({
      ...(q ? { $text: { $search: q, $caseSensitive: false } } : {}),
      ...parsedFilters
    });
  }

  async getExercise(id: string): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById({ _id: id });
    if (!exercise) {
      throw new BadRequestException('Exercise not found');
    }
    return exercise;
  }

  async updateExercise(id: string, exercise: Exercise): Promise<Exercise> {
    const updatedExercise = await this.exerciseModel.findByIdAndUpdate(
      { _id: id },
      exercise,
      { new: true }
    );
    if (!updatedExercise) {
      throw new BadRequestException('Exercise not found');
    }
    return updatedExercise;
  }

  async deleteExercise(id: string): Promise<Exercise> {
    const deletedExercise = await this.exerciseModel.findByIdAndDelete({
      _id: id
    });
    if (!deletedExercise) {
      throw new BadRequestException('Exercise not found');
    }
    return deletedExercise;
  }

  async getExerciseByName(name: string): Promise<Exercise> {
    const exercise = await this.exerciseModel.findOne({ name });
    if (!exercise) {
      throw new BadRequestException('Exercise not found');
    }
    return exercise;
  }

  async getExerciseByCategory(category: string): Promise<Exercise[]> {
    const exercises = await this.exerciseModel.find({ category });
    return exercises;
  }
}
