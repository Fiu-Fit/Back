import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';

export class EditRatingDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  workoutId?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  athleteId?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
