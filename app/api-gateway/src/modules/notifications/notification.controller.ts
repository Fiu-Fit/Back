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
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { ServerController } from '../../shared/server-controller';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Notifications')
@Injectable()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController extends ServerController {
  constructor(httpService: HttpService) {
    super(httpService, 'notifications');
  }

  @Get('goals')
  async getGoalNotifications(@Query('userId') userId: number) {
    const { data } = await firstValueFrom(
      this.httpService.get('/notifications/goals', { params: { userId } })
    );
    return data;
  }

  @Get('messages')
  async getMessageNotifications(@Query('userId') userId: number) {
    const { data } = await firstValueFrom(
      this.httpService.get('/notifications/messages', { params: { userId } })
    );
    return data;
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

  @Delete('goals/:goalId')
  async deleteGoalNotification(@Param('goalId') id: number) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`/notifications/goals/${id}`)
    );
    return data;
  }

  @Delete('messages/:senderId')
  async deleteMessageNotification(@Param('senderId') id: number) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`/notifications/messages/${id}`)
    );
    return data;
  }
}
