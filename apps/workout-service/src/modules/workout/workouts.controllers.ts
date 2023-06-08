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
import { WorkoutDto } from './dto/workout.dto';
import { Workout } from './interfaces/workout.interface';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private workoutsService: WorkoutsService) {}

  @Get()
  getWorkouts(
    @Query('q') q: string,
    @Query('filters') filters: string
  ): Promise<Workout[]> {
    const parsedFilters: Record<string, string> = filters
      ? JSON.parse(filters)
      : {};
    return this.workoutsService.getWorkouts(q, parsedFilters);
  }

  @Post()
  createWorkout(@Body() createWorkoutDto: WorkoutDto): Promise<Workout> {
    return this.workoutsService.createWorkout(createWorkoutDto);
  }

  @Get(':id')
  getWorkoutById(@Param('id') id: string): Promise<Workout> {
    return this.workoutsService.getWorkoutById(id);
  }

  @Delete(':id')
  deleteWorkout(@Param('id') id: string): Promise<Workout> {
    const deletedWorkout = this.workoutsService.deleteWorkout(id);
    return deletedWorkout;
  }

  @Put(':id')
  updateWorkout(
    @Param('id') id: string,
    @Body() workout: Workout
  ): Promise<Workout> {
    return this.workoutsService.updateWorkout(id, workout);
  }
}
