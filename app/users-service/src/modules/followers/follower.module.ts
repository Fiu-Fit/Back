import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { UserLocationModule } from '../user-location/user-location.module';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    HttpModule,
    UserLocationModule
  ],
  controllers: [FollowerController],
  providers:   [FollowerService, PrismaService, UserService]
})
export class FollowerModule {}
