import { Category } from '@fiu-fit/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength
} from 'class-validator';

export class EditExerciseDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  description?: string;

  @IsEnum(Category)
  @IsNotEmpty()
  @IsOptional()
  category?: Category;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  METValue?: number;
}
