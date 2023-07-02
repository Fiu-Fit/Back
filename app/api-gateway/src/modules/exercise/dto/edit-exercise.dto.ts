import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength
} from 'class-validator';
import { Category } from '../../workout/interfaces';

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
