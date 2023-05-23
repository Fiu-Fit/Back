import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';

export class RatingDto {
  @IsString()
  @IsNotEmpty()
  workoutId: string;

  @IsNumber()
  @IsNotEmpty()
  athleteId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
