import { Controller, NotFoundException } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common/decorators';
import { ProgressMetric } from '@prisma/client';
import {
  EditProgressMetricDTO,
  GetProgressMetricsQueryDTO,
  ProgressMetricDTO
} from './dto';
import { CompleteWorkoutDTO } from './dto/complete-workout.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post()
  createProgressMetric(@Body() body: ProgressMetricDTO) {
    return this.progressService.createProgressMetric(body);
  }

  @Get()
  getProgressMetrics(@Query() filter: GetProgressMetricsQueryDTO) {
    return this.progressService.findAndCount(filter);
  }

  @Get(':id')
  async getProgressMetricById(@Param('id') id: number) {
    const progressMetric = await this.progressService.getProgressMetricById(id);
    if (!progressMetric) {
      throw new NotFoundException({ message: 'Progress metric not found' });
    }

    return progressMetric;
  }

  @Put(':id')
  async updateProgressMetric(
    @Param('id') id: number,
    @Body() data: EditProgressMetricDTO
  ) {
    const targetProgressMetric =
      await this.progressService.getProgressMetricById(id);
    if (!targetProgressMetric) {
      throw new NotFoundException({ message: 'Progress metric not found' });
    }
    return this.progressService.editProgressMetric(id, data);
  }

  @Delete(':id')
  deleteProgressMetric(@Param('id') id: number) {
    return this.progressService.deleteProgressMetric(id);
  }

  @Post('complete')
  completeWorkout(
    @Body() completeWorkoutDTO: CompleteWorkoutDTO
  ): Promise<ProgressMetric[]> {
    return this.progressService.completeWorkout(
      completeWorkoutDTO.workoutId,
      completeWorkoutDTO.userId
    );
  }
}
