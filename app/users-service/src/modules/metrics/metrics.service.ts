import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestStatus, Role, UserActivityType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import {
  GetAuthMetricsQueryDTO,
  GetBlockedMetricsQueryDTO,
  GetUserMetricsQueryDTO
} from './dto';
import { TrainerMetrics } from './interfaces';

@Injectable()
export class MetricsService {
  constructor(private prismaService: PrismaService) {}

  async countByMonth(
    where: any,
    modelName: keyof PrismaService,
    year: number
  ): Promise<number[]> {
    const result: number[] = [];
    const model = this.prismaService[modelName] as any;

    if (!model || model.count == undefined) throw new Error('Invalid model');

    for (let i = 0; i < 12; i++) {
      const count = await model.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(year, i),
            lt:  new Date(year, i + 1)
          }
        }
      });
      result.push(count);
    }

    return result;
  }

  getRegisterMetrics(filter: GetAuthMetricsQueryDTO): Promise<number[]> {
    const where = {
      federatedIdentity: filter.federatedIdentity,
      blocked:           filter.blocked
    };

    return this.countByMonth(where, 'user', filter.year);
  }

  getLoginMetrics(filter: GetAuthMetricsQueryDTO): Promise<number[]> {
    const where = {
      type: UserActivityType.Login,
      user: {
        federatedIdentity: filter.federatedIdentity,
        blocked:           filter.blocked
      }
    };

    return this.countByMonth(where, 'userActivity', filter.year);
  }

  getPasswordResetMetrics(filter: GetAuthMetricsQueryDTO): Promise<number[]> {
    const where = {
      type: UserActivityType.PasswordReset,
      user: {
        federatedIdentity: filter.federatedIdentity,
        blocked:           filter.blocked
      }
    };

    return this.countByMonth(where, 'userActivity', filter.year);
  }

  async getUsersMetrics(filter: GetUserMetricsQueryDTO) {
    const count = await this.prismaService.user.groupBy({
      by:     ['role'],
      where:  filter,
      _count: {
        _all: true
      }
    });

    const countedValues = Object.fromEntries(
      count.map(item => [item.role, item._count._all])
    );

    return Object.fromEntries(
      Object.values(Role).map(role => [role, countedValues[role] || 0])
    );
  }

  async createLoginMetric(uid: string) {
    const user = await this.prismaService.user.findUnique({
      where: { uid }
    });

    if (!user) throw new UnauthorizedException('Usuario no existe');

    if (user.blocked) throw new UnauthorizedException('Usuario esta bloqueado');

    await this.prismaService.userActivity.create({
      data: {
        type:   UserActivityType.Login,
        userId: user.id
      }
    });
  }

  async getTrainerMetrics(
    filter: GetUserMetricsQueryDTO
  ): Promise<TrainerMetrics> {
    const trainerCount = await this.prismaService.user.count({
      where: {
        role: Role.Trainer,
        ...filter
      }
    });

    const verifiedTrainerCount = await this.prismaService.verification.count({
      where: {
        status: RequestStatus.Approved,
        user:   {
          role: Role.Trainer,
          ...filter
        }
      }
    });

    return {
      unverifiedTrainers: trainerCount - verifiedTrainerCount,
      verifiedTrainers:   verifiedTrainerCount
    };
  }

  async getBlockedUsersMetrics(
    filter: GetBlockedMetricsQueryDTO
  ): Promise<number[]> {
    const result = [];

    for (let i = 0; i < 12; i++) {
      const count = await this.prismaService.user.count({
        where: {
          federatedIdentity: filter.federatedIdentity,
          blocked:           true,
          blockedAt:         {
            gte: new Date(filter.year, i),
            lt:  new Date(filter.year, i + 1)
          }
        }
      });
      result.push(count);
    }

    return result;
  }
}
