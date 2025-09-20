export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  type: 'employee' | 'customer';
  role: string;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
