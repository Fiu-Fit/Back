import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { UserLocationModule } from '../user-location/user-location.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports:     [HttpModule, UserLocationModule],
  controllers: [NotificationController],
  providers:   [NotificationService, PrismaService, UserService]
})
export class NotificationModule {}
