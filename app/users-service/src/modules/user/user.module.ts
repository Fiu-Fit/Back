import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { FollowerModule } from '../followers/follower.module';
import { FollowerService } from '../followers/follower.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    HttpModule,
    FollowerModule
  ],
  controllers: [UserController],
  providers:   [UserService, FollowerService, PrismaService]
})
export class UserModule {}
