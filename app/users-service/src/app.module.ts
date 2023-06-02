import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FollowerModule } from './modules/followers/follower.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    FollowerModule,
    MetricsModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers:   [AppService]
})
export class AppModule {}
