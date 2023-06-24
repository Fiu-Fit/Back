import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { GetAuthMetricsQueryDTO, GetUserMetricsQueryDTO } from './dto';
import { MetricsService } from './metrics.service';

@UseGuards(AdminGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('login')
  getLoginMetrics(@Query() filter: GetAuthMetricsQueryDTO) {
    return this.metricsService.getLoginMetrics(filter);
  }

  @Get('register')
  getRegisterMetrics(@Query() filter: GetAuthMetricsQueryDTO) {
    return this.metricsService.getRegisterMetrics(filter);
  }

  @Get('password-reset')
  getPasswordResetMetrics(@Query() filter: GetAuthMetricsQueryDTO) {
    return this.metricsService.getPasswordResetMetrics(filter);
  }

  @Get('users')
  getUsersMetrics(@Query() filter: GetUserMetricsQueryDTO) {
    return this.metricsService.getUsersMetrics(filter);
  }

  @Post('login')
  createLoginMetric(@Body('uid') uid: string) {
    return this.metricsService.createLoginMetric(uid);
  }
}
