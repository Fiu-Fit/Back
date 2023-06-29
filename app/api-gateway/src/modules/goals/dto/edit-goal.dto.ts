import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { GoalStatus } from '../interfaces';

export class EditGoalDto {
  @IsString()
  @MaxLength(30)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsOptional()
  @IsNumber()
  targetValue?: number;

  @IsOptional()
  deadline?: Date;

  @IsString()
  @IsOptional()
  exerciseId?: string;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  multimedia?: string[];
}
