import { WorkoutMetric } from '@fiu-fit/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { EditWorkoutDto, WorkoutMetricsFilterDto } from './dto';
import { WorkoutDto } from './dto/workout.dto';
import { Workout } from './schemas/workout.schema';
import { WorkoutService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private workoutsService: WorkoutService) {}

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
    if (!ObjectId.isValid(id)) throw new BadRequestException('Invalid id');

    return this.workoutsService.getWorkoutById(id);
  }

  @Delete(':id')
  deleteWorkout(@Param('id') id: string): Promise<Workout> {
    if (!ObjectId.isValid(id)) throw new BadRequestException('Invalid id');

    const deletedWorkout = this.workoutsService.deleteWorkout(id);
    return deletedWorkout;
  }

  @Put(':id')
  updateWorkout(
    @Param('id') id: string,
    @Body() workout: EditWorkoutDto
  ): Promise<Workout> {
    if (!ObjectId.isValid(id)) throw new BadRequestException('Invalid id');

    return this.workoutsService.updateWorkout(id, workout);
  }

  @Get(':id/metrics')
  getWorkoutMetrics(
    @Param('id') id: string,
    @Query() filters: WorkoutMetricsFilterDto
  ): Promise<WorkoutMetric[]> {
    if (!ObjectId.isValid(id)) throw new BadRequestException('Invalid id');

    return this.workoutsService.getWorkoutMetrics(id, filters);
  }
}
