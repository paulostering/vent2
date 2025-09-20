import { IsEmail, IsString, IsEnum, MinLength, IsOptional } from 'class-validator';
import { EmployeeRole, CustomerRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['employee', 'customer'])
  type: 'employee' | 'customer';

  @IsString()
  role: string;

  @IsString()
  @IsOptional()
  tenantId?: string;
}
