import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { booleanMapper } from './booleanMapper';

export class GetUserMetricsQueryDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(booleanMapper)
  federatedIdentity?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(booleanMapper)
  blocked?: boolean;
}
