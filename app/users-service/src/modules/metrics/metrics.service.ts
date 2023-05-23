import { Injectable } from '@nestjs/common';
import { UserActivityType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { GetAuthMetricsQueryDTO } from './dto';

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
}
