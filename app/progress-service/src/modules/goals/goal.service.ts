import { LoggerFactory } from '@fiu-fit/common';
import { NotificationType } from '@fiu-fit/common/dist/interfaces/notification-type';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Goal, GoalStatus } from '@prisma/client';
import { sumBy } from 'lodash';
import { firstValueFrom } from 'rxjs';
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

  deleteGoal(id: number): Promise<Goal> {
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

    const metrics = await this.progressService.findAndCount(filter);

    // check the value of all metrics returned and compare it with the expected goal value
    const value = sumBy(metrics.rows, 'value');

    if (value < goal.targetValue) {
      return goal;
    }
    const status =
      goal.deadline && goal.deadline >= new Date()
        ? GoalStatus.Completed
        : GoalStatus.CompletedLate;
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

    await firstValueFrom(
      this.httpService.post(
        `${process.env.USER_SERVICE_URL}/notifications/goals`,
        {
          userId: goal.userId,
          goalId: goal.id
        },
        {
          headers: {
            'api-key': process.env.USER_API_KEY
          }
        }
      )
    );

    await this.sendPushNotification(goal);

    // TODO: create whatsapp notification to show it in the user's whatsapp
  }

  async sendPushNotification(goal: Goal) {
    logger.info('Sending push notification...');

    const token = await firstValueFrom(
      this.httpService.get<string>(
        `${process.env.USER_SERVICE_URL}/users/${goal.userId}/token`,
        {
          headers: {
            'api-key': process.env.USER_API_KEY
          }
        }
      )
    );

    logger.info('token: ', token.data);

    if (!token) {
      return;
    }

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
      token: token.data
    };

    admin.messaging().send({ ...message });
    logger.info('Notification sent succesfully!');
  }
}
