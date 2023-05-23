import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProgressMetricsQueryDTO {
  @IsDateString()
  @IsOptional()
  start?: string;

  @IsDateString()
  @IsOptional()
  end?: string;

  @IsString()
  @IsOptional()
  exerciseId?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  userId?: number;
}
