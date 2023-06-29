import { WorkoutMetric } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  Injectable,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';
import { Workout } from './dto/workout.dto';

@ApiTags('Workouts')
@Injectable()
@Controller('workouts')
@UseGuards(AuthGuard)
export class WorkoutController extends ServerController<Workout> {
  constructor(httpService: HttpService) {
    super(httpService, 'workouts');
  }

  @Get(':id/metrics')
  async getWorkoutMetrics(
    @Param('id') id: string,
    @Query() filters: string
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
