import { IsOptional, IsPositive } from 'class-validator';

export class WorkoutMetricsFilterDto {
  @IsOptional()
  @IsPositive()
  year?: number;
}
