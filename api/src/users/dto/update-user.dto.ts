import { IsString, IsEnum, IsBoolean, IsOptional, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEnum(['employee'])
  @IsOptional()
  type?: 'employee';

  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
