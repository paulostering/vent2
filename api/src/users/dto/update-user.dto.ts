import { IsString, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsEnum(['employee', 'customer'])
  @IsOptional()
  type?: 'employee' | 'customer';

  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
