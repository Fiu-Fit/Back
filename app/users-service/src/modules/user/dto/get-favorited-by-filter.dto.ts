import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FavoritedByFilterDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  year?: number;
}
