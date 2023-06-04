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

  async getUserNotifications(
    userId: number
  ): Promise<Array<GoalNotification | MessageNotification>> {
    const goalNotifications =
      await this.prismaService.goalNotification.findMany({
        where:   { userId },
        orderBy: { receivedAt: 'desc' }
      });

    const messageNotifications =
      await this.prismaService.messageNotification.findMany({
        where:   { userId },
        orderBy: { receivedAt: 'desc' }
      });

    return [...goalNotifications, ...messageNotifications];
  }

  async deleteGoalNotification(id: number): Promise<GoalNotification> {
    const notification = await this.prismaService.goalNotification
      .delete({
        where: { id }
      })
      .catch(() => {
        throw new NotFoundException({ message: 'Notification not found' });
      });

    if (!notification) {
      throw new NotFoundException({ message: 'Notification not found' });
    }

    return notification;
  }

  async deleteMessageNotification(id: number): Promise<MessageNotification> {
    const notification = await this.prismaService.messageNotification
      .delete({
        where: { id }
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
