import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { GoalNotification, MessageNotification } from '@prisma/client';
import { GoalNotificationDTO } from './dto/goal-notification.dto';
import { MessageNotificationDTO } from './dto/message-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('goals')
  getGoalNotifications(
    @Query('userId') userId: number
  ): Promise<GoalNotification[]> {
    return this.notificationService.getGoalNotifications(userId);
  }

  @Get('messages')
  getMessageNotifications(
    @Query('userId') userId: number
  ): Promise<MessageNotification[]> {
    return this.notificationService.getMessageNotifications(userId);
  }

  @Post('goals')
  createGoalNotification(
    @Body() data: GoalNotificationDTO
  ): Promise<GoalNotification> {
    return this.notificationService.createGoalNotification(data);
  }

  @Post('messages')
  createMessageNotification(
    @Body() data: MessageNotificationDTO
  ): Promise<MessageNotification> {
    return this.notificationService.createMessageNotification(data);
  }

  @Delete('goals/:goalId')
  async deleteNotification(
    @Param('goalId') id: number
  ): Promise<GoalNotification | null> {
    try {
      return await this.notificationService.deleteGoalNotification(id);
    } catch (error) {
      throw error;
    }
  }

  @Delete('messages/:senderId')
  async deleteMessageNotification(@Param('senderId') senderId: number) {
    try {
      await this.notificationService.deleteMessageNotifications(senderId);
    } catch (error) {
      throw error;
    }
  }
}
