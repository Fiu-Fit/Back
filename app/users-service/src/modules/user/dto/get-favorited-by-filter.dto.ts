import { IsNumber, IsOptional } from 'class-validator';

export class FavoritedByFilterDto {
  @IsOptional()
  @IsNumber()
  year?: number;
}
