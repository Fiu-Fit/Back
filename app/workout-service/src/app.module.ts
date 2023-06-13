import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { RatingModule } from './modules/ratings/rating.module';
import { WorkoutsModule } from './modules/workout/workouts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WorkoutsModule,
    ExerciseModule,
    RatingModule,
    MongooseModule.forRoot(process.env.DATABASE_URL || ''),
    HttpModule
  ],
  controllers: []
})
export class AppModule {}
