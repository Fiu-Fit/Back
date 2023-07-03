import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { booleanMapper } from './booleanMapper';

export class GetBlockedMetricsQueryDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(booleanMapper)
  federatedIdentity?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  year: number = new Date().getFullYear();
}
