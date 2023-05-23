import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';

const booleanMapper = (transformParams: TransformFnParams) => {
  switch (transformParams.value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
};

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
