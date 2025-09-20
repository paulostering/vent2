export class RoleResponseDto {
  id: string;
  name: string;
  description: string;
  permissions: PermissionDto[];
  isActive: boolean;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PermissionDto {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}
