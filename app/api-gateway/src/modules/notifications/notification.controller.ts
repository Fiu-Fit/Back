import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { AuthGuard } from '../auth/auth.guard';
import { GoalNotificationDTO, MessageNotificationDTO } from './dto';

@Injectable()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  private readonly entityName: string = 'notifications';

  constructor(private httpService: HttpService) {}

  @Get('goals')
  async getGoalNotifications(@Query('userId') userId: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/goals`, { params: { userId } })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Get('messages')
  async getMessageNotifications(@Query('userId') userId: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/messages`, {
          params: { userId }
        })
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Post('goals')
  async createGoalNotification(
    @Body() goalNotificationDto: GoalNotificationDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`/${this.entityName}/goals`, goalNotificationDto)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Post('messages')
  async createMessageNotification(
    @Body() messageNotificationDto: MessageNotificationDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`/${this.entityName}/messages`, messageNotificationDto)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Delete('goals/:goalId')
  async deleteGoalNotification(@Param('goalId') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/goals/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }

  @Delete('messages/:senderId')
  async deleteMessageNotification(@Param('senderId') id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/messages/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );
    return data;
  }
}
