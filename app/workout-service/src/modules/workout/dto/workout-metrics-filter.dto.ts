import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class WorkoutMetricsFilterDto {
  @IsNumber()
  @Type(() => Number)
  year: number;
}
