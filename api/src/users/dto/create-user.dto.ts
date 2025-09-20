import { IsEmail, IsString, IsEnum, MinLength, IsOptional } from 'class-validator';
import { EmployeeRole, CustomerRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['employee'])
  type: 'employee';

  @IsString()
  role: string;

  @IsString()
  @IsOptional()
  tenantId?: string;
}
