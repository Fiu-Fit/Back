import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserLocation,
  UserLocationsSchema
} from './schema/user-location.schema';
import { UserLocationService } from './user-location.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    MongooseModule.forFeature([
      { name: UserLocation.name, schema: UserLocationsSchema }
    ])
  ],
  providers: [UserLocationService],
  exports:   [UserLocationService]
})
export class UserLocationModule {}
