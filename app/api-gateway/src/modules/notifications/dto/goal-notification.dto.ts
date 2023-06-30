import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GoalNotificationDTO {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  goalId: number;

  @IsString()
  @IsNotEmpty()
  goalTitle: string;
}
