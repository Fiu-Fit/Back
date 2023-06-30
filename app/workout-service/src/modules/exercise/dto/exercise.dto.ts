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

export class ExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  description: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @IsNumber()
  @IsPositive()
  METValue: number;

  @IsString()
  @IsOptional()
  image: string;
}
