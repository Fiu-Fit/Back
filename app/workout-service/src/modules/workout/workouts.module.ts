import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingService } from '../ratings/rating.service';
import { Rating, RatingSchema } from '../ratings/schemas/rating.schema';
import { Workout, WorkoutSchema } from './schemas/workout.schema';
import { WorkoutsController } from './workouts.controllers';
import { WorkoutsService } from './workouts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workout.name, schema: WorkoutSchema },
      { name: Rating.name, schema: RatingSchema }
    ]),
    HttpModule
  ],
  exports:     [WorkoutsService],
  controllers: [WorkoutsController],
  providers:   [WorkoutsService, RatingService]
})
export class WorkoutsModule {}
