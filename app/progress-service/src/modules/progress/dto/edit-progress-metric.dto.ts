import { Unit } from '@prisma/client';
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
  burntCalories: number;

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
