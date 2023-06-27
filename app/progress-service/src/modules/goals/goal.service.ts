import { LoggerFactory, Service, User } from '@fiu-fit/common';
import { NotificationType } from '@fiu-fit/common/dist/interfaces/notification-type';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Goal, GoalStatus } from '@prisma/client';
import { sumBy } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { Twilio } from 'twilio';
import { admin } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { GetProgressMetricsQueryDTO } from '../progress/dto';
import { ProgressService } from '../progress/progress.service';
import { GetGoalsQueryDto } from './dto/get-goals-query.dto';
import { GoalDto } from './dto/goal.dto';

const logger = LoggerFactory('goal-service');

@Injectable()
export class GoalService {
  constructor(
    private prismaService: PrismaService,
    private progressService: ProgressService,
    private httpService: HttpService
  ) {}

  createGoal(goal: GoalDto): Promise<Goal> {
    return this.prismaService.goal.create({ data: goal });
  }

  async getGoalById(id: number): Promise<Goal | null> {
    const goal = await this.prismaService.goal.findUnique({
      where: { id }
    });

    if (!goal) {
      return null;
    }

    return this.checkGoalStatus(goal);
  }

  async findAll(filter: GetGoalsQueryDto): Promise<Goal[]> {
    const goals = await this.prismaService.goal.findMany({
      orderBy: { id: 'asc' },
      where:   {
        userId:     filter.userId,
        exerciseId: filter.exerciseId
      }
    });

    return Promise.all(goals.map(goal => this.checkGoalStatus(goal)));
  }

  editGoal(id: number, goal: Goal): Promise<Goal> {
    return this.prismaService.goal.update({
      where: { id },
      data:  goal
    });
  }

  async deleteGoal(id: number): Promise<Goal> {
    const {
      data: { apiKey }
    } = await firstValueFrom(
      this.httpService.get<Service>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/name/user`
      )
    );

    await firstValueFrom(
      this.httpService.delete(
        `${process.env.USER_SERVICE_URL}/notifications/goals/${id}`,
        {
          headers: {
            'api-key': apiKey
          }
        }
      )
    );
    return this.prismaService.goal.delete({
      where: { id }
    });
  }

  /**
   * Checks if the Goal is completed or not. If it is not, it will check the value of all metrics
   * related to the Goal and compare it with the target goal value.
   * The Goal status will be updated if the target value is reached.
   * @param goal the goal to check its status.
   * @returns an updated Goal or the same passed as input if it did not update.
   */
  async checkGoalStatus(goal: Goal): Promise<Goal> {
    if (
      goal.status === GoalStatus.Completed ||
      goal.status === GoalStatus.CompletedLate
    ) {
      return goal;
    }

    const filter = new GetProgressMetricsQueryDTO();
    filter.exerciseId = goal.exerciseId.toString();
    filter.start = new Date(goal.createdAt).toISOString();
    filter.userId = goal.userId;

    const metrics = await this.progressService.findAndCount(filter);

    // check the value of all metrics returned and compare it with the expected goal value
    const value = sumBy(metrics.rows, 'value');

    if (value < goal.targetValue) {
      return goal;
    }

    let status;
    if (goal.deadline && goal.deadline < new Date()) {
      status = GoalStatus.CompletedLate;
    } else {
      status = GoalStatus.Completed;
    }

    return this.completeGoal(goal, status);
  }

  /**
   * Updates the status of a Goal.
   * @param goal the goal to update its status.
   * @param status the new status of the Goal.
   * @returns the updated Goal.
   */
  completeGoal(goal: Goal, status: GoalStatus): Promise<Goal> {
    this.sendGoalNotifications(goal);

    return this.editGoal(goal.id, { ...goal, status });
  }

  async sendGoalNotifications(goal: Goal) {
    logger.info('creating goal notifications...');

    const {
      data: { apiKey }
    } = await firstValueFrom(
      this.httpService.get<Service>(
        `${process.env.SERVICE_REGISTRY_URL}/service-registry/name/user`
      )
    );

    await firstValueFrom(
      this.httpService.post(
        `${process.env.USER_SERVICE_URL}/notifications/goals`,
        {
          userId:    goal.userId,
          goalId:    goal.id,
          goalTitle: goal.title
        },
        {
          headers: {
            'api-key': apiKey
          }
        }
      )
    );

    const user = await firstValueFrom(
      this.httpService.get<User>(
        `${process.env.USER_SERVICE_URL}/users/${goal.userId}`,
        {
          headers: {
            'api-key': apiKey
          }
        }
      )
    );

    if (!user.data) {
      logger.debug('User not found');
      return;
    }

    logger.debug('user: ', user.data);

    this.sendPushNotification(goal, user.data.deviceToken);

    if (!user.data.phoneNumber) {
      logger.debug('User does not have a phone number');
      return;
    }
    this.sendWhatsappNotification(goal, user.data.phoneNumber);
  }

  sendPushNotification(goal: Goal, token: string) {
    logger.info('Sending push notification...');

    if (!token) {
      return;
    }

    logger.info('token: ', token);

    const message = {
      notification: {
        title:    'Meta completada',
        body:     'Felicitaciones, completaste una meta!',
        imageUrl: process.env.GOAL_COMPLETED_IMAGE_URL
      },
      data: {
        goalId: goal.id.toString(),
        type:   NotificationType.GoalCompleted.toString()
      },
      token
    };

    admin.messaging().send({ ...message });
    logger.info('Notification sent succesfully!');
  }

  sendWhatsappNotification(goal: Goal, phoneNumber: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = new Twilio(accountSid, authToken);

    client.messages
      .create({
        body: `Felicitaciones, completaste la meta "${goal.title}"!`,
        from: 'whatsapp:+14155238886',
        to:   'whatsapp:' + phoneNumber
      })
      .then((message: { sid: any }) => logger.info(message.sid));

    logger.info('Whatsapp notification sent succesfully!');
  }
}
