import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength
} from 'class-validator';
import { Category } from '../../workout/interfaces';

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
}
