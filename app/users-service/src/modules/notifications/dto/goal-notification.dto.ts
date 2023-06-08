import { IsNotEmpty, IsNumber } from 'class-validator';

export class GoalNotificationDTO {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  goalId: number;
}
