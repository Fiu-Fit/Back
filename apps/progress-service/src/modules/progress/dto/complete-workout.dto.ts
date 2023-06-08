import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CompleteWorkoutDTO {
  @IsString()
  @IsNotEmpty()
  workoutId: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
