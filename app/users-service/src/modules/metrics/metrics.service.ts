import { Page } from '@fiu-fit/common';
import { Injectable } from '@nestjs/common';
import { User, UserActivityType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { GetAuthMetricsQueryDTO } from './dto';

@Injectable()
export class MetricsService {
  constructor(private prismaService: PrismaService) {}

  async findAndCountUsers(where: any): Promise<Page<any>> {
    return {
      rows: await this.prismaService.user.findMany({
        where,
        select: {
          id:                true,
          firstName:         true,
          lastName:          true,
          email:             true,
          federatedIdentity: true,
          blocked:           true,
          createdAt:         true
        }
      }),
      count: await this.prismaService.user.count({ where })
    };
  }

  async findAndCountUserActivities(where: any): Promise<Page<any>> {
    return {
      rows: await this.prismaService.userActivity.findMany({
        where
      }),
      count: await this.prismaService.userActivity.count({ where })
    };
  }

  getRegisterMetrics(filter: GetAuthMetricsQueryDTO): Promise<Page<User>> {
    const where = {
      federatedIdentity: filter.federatedIdentity,
      blocked:           filter.blocked,
      createdAt:         {
        gte: filter.start,
        lte: filter.end
      }
    };

    return this.findAndCountUsers(where);
  }

  getLoginMetrics(filter: GetAuthMetricsQueryDTO): Promise<Page<User>> {
    const where = {
      type:      UserActivityType.Login,
      timestamp: {
        gte: filter.start,
        lte: filter.end
      },
      user: {
        federatedIdentity: filter.federatedIdentity,
        blocked:           filter.blocked
      }
    };

    return this.findAndCountUserActivities(where);
  }

  getPasswordResetMetrics(filter: GetAuthMetricsQueryDTO): Promise<Page<User>> {
    const where = {
      type:      UserActivityType.PasswordReset,
      timestamp: {
        gte: filter.start,
        lte: filter.end
      },
      user: {
        federatedIdentity: filter.federatedIdentity,
        blocked:           filter.blocked
      }
    };

    return this.findAndCountUserActivities(where);
  }
}
