import { ServiceStatus } from '@fiu-fit/common';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ServiceRegistryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(ServiceStatus)
  @IsOptional()
  status: ServiceStatus;
}
