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
import { firstValueFrom } from 'rxjs';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('progress')
export class ProgressController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'progress');
  }

  @Post('complete')
  async completeWorkout(@Body() completeWorkoutDto: any) {
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
