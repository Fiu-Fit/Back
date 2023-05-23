import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetGoalsQueryDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  exerciseId?: string;
}
