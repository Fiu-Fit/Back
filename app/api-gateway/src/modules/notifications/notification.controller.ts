import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Injectable,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'notifications');
  }

  @Post('goals')
  async createGoalNotification(@Body() goalNotificationDto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post('/notifications/goals', goalNotificationDto)
    );
    return data;
  }

  @Post('messages')
  async createMessageNotification(@Body() messageNotificationDto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post('/notifications/messages', messageNotificationDto)
    );
    return data;
  }

  @Delete('goals/:id')
  async deleteGoalNotification(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`/notifications/goals/${id}`)
    );
    return data;
  }

  @Delete('messages/:id')
  async deleteMessageNotification(@Param('id') id: number) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`/notifications/messages/${id}`)
    );
    return data;
  }
}
