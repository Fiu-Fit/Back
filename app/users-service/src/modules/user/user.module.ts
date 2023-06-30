import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';

import { UserLocationModule } from '../user-location/user-location.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    HttpModule,
    UserLocationModule
  ],
  controllers: [UserController],
  providers:   [UserService, PrismaService]
})
export class UserModule {}
