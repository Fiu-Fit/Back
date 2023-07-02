import { Role } from '@prisma/client';
import {
  Equals,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

const ADMIN_DEFAULT_BODY_WEIGHT = -1;

export class AdminRegisterRequest {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @Equals(Role.Admin)
  role: Role = Role.Admin;

  @IsNumber()
  @Equals(ADMIN_DEFAULT_BODY_WEIGHT)
  bodyWeight: number = -1;
}
