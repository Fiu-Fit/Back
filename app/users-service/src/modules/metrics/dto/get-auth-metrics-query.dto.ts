import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { booleanMapper } from './booleanMapper';

export class GetAuthMetricsQueryDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(booleanMapper)
  federatedIdentity?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(booleanMapper)
  blocked?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  year: number = new Date().getFullYear();
}
