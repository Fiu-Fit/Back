import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FollowerModule } from './modules/followers/follower.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { UserModule } from './modules/user/user.module';
import { UserLocationModule } from './modules/user-location/user-location.module';
import { VerificationModule } from './modules/verifications/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.LOCATION_DATABASE_URL || ''),
    UserModule,
    AuthModule,
    FollowerModule,
    VerificationModule,
    MetricsModule,
    NotificationModule,
    UserLocationModule,
    HttpModule
  ],
  controllers: [AppController],
  providers:   [AppService]
})
export class AppModule {}
