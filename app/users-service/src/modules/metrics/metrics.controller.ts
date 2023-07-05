import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import {
  GetAuthMetricsQueryDTO,
  GetBlockedMetricsQueryDTO,
  GetUserMetricsQueryDTO
} from './dto';
import { TrainerMetrics } from './interfaces';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @UseGuards(AdminGuard)
  @Get('login')
  getLoginMetrics(@Query() filter: GetAuthMetricsQueryDTO) {
    return this.metricsService.getLoginMetrics(filter);
  }

  @UseGuards(AdminGuard)
  @Get('register')
  getRegisterMetrics(@Query() filter: GetAuthMetricsQueryDTO) {
    return this.metricsService.getRegisterMetrics(filter);
  }

  @UseGuards(AdminGuard)
  @Get('password-reset')
  getPasswordResetMetrics(@Query() filter: GetAuthMetricsQueryDTO) {
    return this.metricsService.getPasswordResetMetrics(filter);
  }

  @UseGuards(AdminGuard)
  @Get('users')
  getUsersMetrics(@Query() filter: GetUserMetricsQueryDTO) {
    return this.metricsService.getUsersMetrics(filter);
  }

  @Post('login')
  createLoginMetric(@Body('uid') uid: string) {
    return this.metricsService.createLoginMetric(uid);
  }

  @UseGuards(AdminGuard)
  @Get('trainers')
  getTrainerMetrics(
    @Query() filter: GetUserMetricsQueryDTO
  ): Promise<TrainerMetrics> {
    return this.metricsService.getTrainerMetrics(filter);
  }

  @UseGuards(AdminGuard)
  @Get('blocked')
  getBlockedUsersMetrics(
    @Query() filter: GetBlockedMetricsQueryDTO
  ): Promise<number[]> {
    return this.metricsService.getBlockedUsersMetrics(filter);
  }
}
