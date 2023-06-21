import { WorkoutMetric } from '@fiu-fit/common';
import { HttpService } from '@nestjs/axios';
import { Controller, Get, Injectable, Param, UseGuards } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
@Controller('workouts')
@UseGuards(AuthGuard)
export class WorkoutController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'workouts');
  }

  @Get('metrics/:id')
  async getWorkoutMetrics(@Param('id') id: string): Promise<WorkoutMetric> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WorkoutMetric>(`workouts/metrics/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
