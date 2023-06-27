import { RatingCount } from '@fiu-fit/common';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class WorkoutMetricDto {
  @IsNumber()
  @IsNotEmpty()
  favoriteCount: number;

  @IsNumber()
  @IsNotEmpty()
  averageRating: number;

  @IsNumber(undefined, { each: true })
  @Length(5, 5)
  @IsNotEmpty()
  ratings: RatingCount[];
}
