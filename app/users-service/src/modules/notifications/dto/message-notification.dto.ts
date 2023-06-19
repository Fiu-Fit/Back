import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MessageNotificationDTO {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  messageId: number;

  @IsString()
  @IsNotEmpty()
  senderName: string;
}
