import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { AuthGuard } from '../auth/auth.guard';
import {
  CompleteWorkoutDTO,
  EditProgressMetricDTO,
  GetProgressMetricsQueryDTO,
  ProgressMetricDTO
} from './dto';

@UseGuards(AuthGuard)
@Controller('progress')
export class ProgressController {
  private readonly entityName: string = 'progress';

  constructor(private httpService: HttpService) {}

  @Post()
  public async createProgressMetric(@Body() body: ProgressMetricDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.entityName, body)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async getProgressMetrics(@Query() filter: GetProgressMetricsQueryDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}`, {
          params: filter
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id')
  public async getProgressMetricById(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Delete(':id')
  public async deleteProgressMetric(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async updateProgressMetric(
    @Param('id') id: string,
    @Body() entity: EditProgressMetricDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, entity)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Post('complete')
  async completeWorkout(@Body() completeWorkoutDto: CompleteWorkoutDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .post('/progress/complete', completeWorkoutDto)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Get('user-progress/:userId')
  async getUserProgress(
    @Param('userId') userId: number,
    @Query() filter: GetProgressMetricsQueryDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/progress/user-progress/${userId}`, { params: filter })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }
}
