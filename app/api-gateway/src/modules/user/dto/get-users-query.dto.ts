import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { Role } from '../interfaces/user.interface';

export class GetUsersQueryDTO {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((id: string) => Number(id))
  )
  ids?: number[];

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  role?: Role;

  @IsOptional()
  @IsString()
  params?: string;

  [key: string]: string | number[] | undefined;
}
