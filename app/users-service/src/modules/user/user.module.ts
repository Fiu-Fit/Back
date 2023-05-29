import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaService } from '../../prisma.service';
import {
  UserLocation,
  UserLocationsSchema
} from '../user-location/schema/user-location.schema';
import { UserLocationModule } from '../user-location/user-location.module';
import { UserLocationService } from '../user-location/user-location.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    HttpModule,
    UserLocationModule,
    MongooseModule.forFeature([
      { name: UserLocation.name, schema: UserLocationsSchema }
    ])
  ],
  controllers: [UserController],
  providers:   [UserService, PrismaService, UserLocationService]
})
export class UserModule {}
