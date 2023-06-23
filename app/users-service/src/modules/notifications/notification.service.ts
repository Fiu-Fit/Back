import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalNotification, MessageNotification } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { GoalNotificationDTO } from './dto/goal-notification.dto';
import { MessageNotificationDTO } from './dto/message-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  createGoalNotification(data: GoalNotificationDTO): Promise<GoalNotification> {
    return this.prismaService.goalNotification.create({ data });
  }

  createMessageNotification(
    data: MessageNotificationDTO
  ): Promise<MessageNotification> {
    return this.prismaService.messageNotification.create({ data });
  }

  getGoalNotifications(userId: number): Promise<GoalNotification[]> {
    return this.prismaService.goalNotification.findMany({
      where:   { userId },
      orderBy: { receivedAt: 'desc' }
    });
  }

  getMessageNotifications(userId: number): Promise<MessageNotification[]> {
    return this.prismaService.messageNotification.findMany({
      where:   { userId },
      orderBy: { receivedAt: 'desc' }
    });
  }

  async deleteGoalNotification(goalId: number): Promise<GoalNotification> {
    const notification = await this.prismaService.goalNotification
      .delete({
        where: { goalId }
      })
      .catch(() => {
        throw new NotFoundException({ message: 'Notification not found' });
      });

    if (!notification) {
      throw new NotFoundException({ message: 'Notification not found' });
    }

    return notification;
  }

  async deleteMessageNotification(
    messageId: number
  ): Promise<MessageNotification> {
    const notification = await this.prismaService.messageNotification
      .delete({
        where: { messageId }
      })
      .catch(() => {
        throw new NotFoundException({ message: 'Notification not found' });
      });

    if (!notification) {
      throw new NotFoundException({ message: 'Notification not found' });
    }

    return notification;
  }
}
