import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive
} from 'class-validator';
import { Unit } from '../interfaces';

export class ProgressMetricDTO {
  @IsNumber()
  @IsPositive()
  timeSpent: number;

  @IsNumber()
  value: number;

  @IsEnum(Unit)
  unit: Unit;

  @IsNotEmpty()
  exerciseId: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  updatedAt?: Date;
}
