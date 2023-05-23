import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    HttpModule
  ],
  controllers: [FollowerController],
  providers:   [FollowerService, PrismaService, UserService]
})
export class FollowerModule {}
