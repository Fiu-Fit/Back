import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MessageNotificationDTO {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @IsString()
  @IsNotEmpty()
  senderName: string;
}
