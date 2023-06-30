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
import { firstValueFrom } from 'rxjs';
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
      this.httpService.get(`/${this.entityName}/goals`, { params: { userId } })
    );
    return data;
  }

  @Get('messages')
  async getMessageNotifications(@Query('userId') userId: number) {
    const { data } = await firstValueFrom(
      this.httpService.get(`/${this.entityName}/messages`, {
        params: { userId }
      })
    );
    return data;
  }

  @Post('goals')
  async createGoalNotification(
    @Body() goalNotificationDto: GoalNotificationDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService.post(`/${this.entityName}/goals`, goalNotificationDto)
    );
    return data;
  }

  @Post('messages')
  async createMessageNotification(
    @Body() messageNotificationDto: MessageNotificationDTO
  ) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `/${this.entityName}/messages`,
        messageNotificationDto
      )
    );
    return data;
  }

  @Delete('goals/:goalId')
  async deleteGoalNotification(@Param('goalId') id: number) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`/${this.entityName}/goals/${id}`)
    );
    return data;
  }

  @Delete('messages/:senderId')
  async deleteMessageNotification(@Param('senderId') id: number) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`/${this.entityName}/messages/${id}`)
    );
    return data;
  }
}
