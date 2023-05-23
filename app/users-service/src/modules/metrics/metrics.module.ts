import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  controllers: [MetricsController],
  providers:   [MetricsService, PrismaService]
})
export class MetricsModule {}
