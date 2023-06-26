import { LoggerFactory } from '@fiu-fit/common';
import { NotificationType } from '@fiu-fit/common/dist/interfaces/notification-type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalNotification, MessageNotification } from '@prisma/client';
import { admin } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { GoalNotificationDTO } from './dto/goal-notification.dto';
import { MessageNotificationDTO } from './dto/message-notification.dto';

const logger = LoggerFactory('notification-service');

@Injectable()
export class NotificationService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService
  ) {}

  createGoalNotification(data: GoalNotificationDTO): Promise<GoalNotification> {
    return this.prismaService.goalNotification.create({ data });
  }

  async createMessageNotification(
    data: MessageNotificationDTO
  ): Promise<MessageNotification> {
    const notification = await this.prismaService.messageNotification.create({
      data
    });

    // send push notification to user
    const user = await this.userService.getUserById(data.userId);

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    this.sendPushMessageNotification(
      user.deviceToken,
      data.senderId,
      data.senderName
    );

    return notification;
  }

  sendPushMessageNotification(
    token: string,
    senderId: number,
    senderName: string
  ) {
    logger.info('Sending push notification...');

    if (!token) {
      return;
    }

    logger.info('token: ', token);

    const message = {
      notification: {
        title: 'Mensaje nuevo',
        body:  `${senderName} te envió un mensaje!`
      },
      data: {
        senderId: senderId.toString(),
        type:     NotificationType.NewMessage.toString()
      },
      token
    };

    admin.messaging().send({ ...message });
    logger.info('Notification sent succesfully!');
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

  deleteMessageNotifications(senderId: number) {
    return this.prismaService.messageNotification.deleteMany({
      where: { senderId }
    });
  }
}
