import { WorkoutMetric } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { AuthGuard } from '../auth/auth.guard';
import { WorkoutDto, WorkoutMetricsFilterDto } from './dto';

@Injectable()
@Controller('workouts')
@UseGuards(AuthGuard)
export class WorkoutController {
  private readonly entityName: string = 'workouts';

  constructor(private httpService: HttpService) {}

  @Post()
  public async createWorkout(@Body() workout: WorkoutDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.entityName, workout)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async getWorkouts(
    @Query('q') q: string,
    @Query('filters') filters: string
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}`, {
          params: {
            q,
            filters
          }
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id')
  public async getWorkoutById(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Delete(':id')
  public async deleteWorkout(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async updateWorkout(
    @Param('id') id: string,
    @Body() workout: Partial<WorkoutDto>
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, workout)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id/metrics')
  async getWorkoutMetrics(
    @Param('id') id: string,
    @Query() filters: WorkoutMetricsFilterDto
  ): Promise<WorkoutMetric> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WorkoutMetric>(`workouts/${id}/metrics`, {
          params: filters
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
