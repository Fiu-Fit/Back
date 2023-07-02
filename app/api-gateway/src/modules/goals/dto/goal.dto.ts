import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { GoalStatus } from '../interfaces';

export class GoalDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(100)
  description: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  targetValue: number;

  @IsOptional()
  deadline: Date;

  @IsString()
  exerciseId: string;

  @IsEnum(GoalStatus)
  status: GoalStatus;

  @IsArray()
  @IsString({ each: true })
  multimedia: string[];
}
