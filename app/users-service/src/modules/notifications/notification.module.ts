import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  controllers: [NotificationController],
  providers:   [NotificationService, PrismaService]
})
export class NotificationModule {}
