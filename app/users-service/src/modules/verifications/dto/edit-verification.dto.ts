import { RequestStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class EditVerificationDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  resourceId?: string;

  @IsDateString()
  @IsOptional()
  receivedAt?: Date;
}
