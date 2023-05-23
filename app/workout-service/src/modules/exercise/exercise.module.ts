import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { Exercise, ExerciseSchema } from './schemas/exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }])
  ],
  exports:     [ExerciseService],
  controllers: [ExerciseController],
  providers:   [ExerciseService]
})
export class ExerciseModule {}
