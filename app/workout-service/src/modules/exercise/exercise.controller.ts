import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ExerciseDto } from './dto/exercise.dto';
import { ExerciseService } from './exercise.service';
import { Exercise } from './schemas/exercise.schema';

@Controller('exercises')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Post()
  createExercise(@Body() newExercise: ExerciseDto): Promise<Exercise> {
    return this.exerciseService.createExercise(newExercise);
  }

  @Get()
  getExercises(
    @Query('q') q: string,
    @Query('filters') filters: string
  ): Promise<Exercise[]> {
    const parsedFilters: Record<string, string> = filters
      ? JSON.parse(filters)
      : {};

    return this.exerciseService.getExercises(q, parsedFilters);
  }

  @Get(':id')
  getExercise(@Param('id') id: string): Promise<Exercise> {
    return this.exerciseService.getExercise(id);
  }

  @Put(':id')
  updateExercise(
    @Param('id') id: string,
    @Body() exercise: Exercise
  ): Promise<Exercise> {
    return this.exerciseService.updateExercise(id, exercise);
  }

  @Delete(':id')
  deleteExercise(@Param('id') id: string): Promise<Exercise> {
    return this.exerciseService.deleteExercise(id);
  }

  @Get('name/:name')
  getExerciseByName(@Param('name') name: string): Promise<Exercise> {
    return this.exerciseService.getExerciseByName(name);
  }

  @Get('category/:category')
  getExerciseByCategory(
    @Param('category') category: string
  ): Promise<Exercise[]> {
    return this.exerciseService.getExerciseByCategory(category);
  }
}
