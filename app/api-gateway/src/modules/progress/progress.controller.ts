import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';
import { ProgressMetricDTO } from './dto/progress-metric.dto';
import { ProgressMetric } from './dto/progress.dto';

@ApiTags('Progress')
@UseGuards(AuthGuard)
@Controller('progress')
export class ProgressController extends ServerController<ProgressMetric> {
  constructor(httpService: HttpService) {
    super(httpService, 'progress');
  }

  @Post('complete')
  async completeWorkout(@Body() completeWorkoutDto: ProgressMetricDTO) {
    const { data } = await firstValueFrom(
      this.httpService.post('/progress/complete', completeWorkoutDto)
    );
    return data;
  }

  @Get('user-progress/:userId')
  async getUserProgress(
    @Param('userId') userId: number,
    @Query() params: { [key: string]: string }
  ) {
    const { data } = await firstValueFrom(
      this.httpService.get(`/progress/user-progress/${userId}`, { params })
    );
    return data;
  }
}
