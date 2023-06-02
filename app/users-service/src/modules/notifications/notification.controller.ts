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

  @Get()
  getNotifications(
    @Query('userId') userId: number
  ): Promise<Array<GoalNotification | MessageNotification>> {
    return this.notificationService.getUserNotifications(userId);
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

  @Delete('goals/:id')
  deleteNotification(@Param('id') id: number): Promise<GoalNotification> {
    return this.notificationService.deleteGoalNotification(id);
  }

  @Delete('messages/:id')
  deleteMessageNotification(
    @Param('id') id: number
  ): Promise<MessageNotification> {
    return this.notificationService.deleteMessageNotification(id);
  }
}
