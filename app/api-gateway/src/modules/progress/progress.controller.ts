import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('progress')
export class ProgressController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'progress');
  }

  @Post('complete-workout')
  async completeWorkout(@Body() completeWorkoutDto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post('/progress/complete-workout', completeWorkoutDto)
    );
    return data;
  }
}
