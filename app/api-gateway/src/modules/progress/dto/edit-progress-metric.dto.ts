import { Unit } from '@fiu-fit/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive
} from 'class-validator';

export class EditProgressMetricDTO {
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
