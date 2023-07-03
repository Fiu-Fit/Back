import { Category, WorkoutExercise } from '@fiu-fit/common';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min
} from 'class-validator';

export class EditWorkoutDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  duration?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @IsOptional()
  difficulty?: number;

  @IsEnum(Category)
  @IsNotEmpty()
  @IsOptional()
  category?: Category;

  @IsOptional()
  exercises?: WorkoutExercise[];

  @IsOptional()
  athleteIds?: number[];

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  authorId?: number;

  @IsOptional()
  updatedAt?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  multimedia?: string[];

  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
}
