import { IsNotEmpty, IsNumber } from 'class-validator';

export class MessageNotificationDTO {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  messageId: number;
}
