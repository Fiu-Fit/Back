import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceConfig, ServiceName } from '../../shared/service-config';
import { AuthModule } from '../auth/auth.module';
import { FollowerController } from './follower.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports:    [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ServiceConfig.createHttpModuleOptions(
          ServiceName.Followers,
          configService
        ),
      inject: [ConfigService]
    })
  ],
  exports:     [],
  providers:   [],
  controllers: [FollowerController]
})
export class FollowerModule {}
