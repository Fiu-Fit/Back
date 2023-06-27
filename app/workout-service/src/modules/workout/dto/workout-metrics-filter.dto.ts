import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class WorkoutMetricsFilterDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  year?: number;
}
