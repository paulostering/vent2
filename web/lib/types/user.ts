export interface User {
  id: string;
  email: string;
  name: string;
  type: 'employee' | 'customer';
  role: string;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  type: 'employee' | 'customer';
  role: string;
  tenantId: string;
}

export interface UpdateUserData {
  name?: string;
  type?: 'employee' | 'customer';
  role?: string;
  isActive?: boolean;
}

// Employee roles
export enum EmployeeRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  WAREHOUSE = 'warehouse',
  CUSTOMER_SERVICE = 'customer_service',
}

// Customer roles
export enum CustomerRole {
  MANAGER = 'manager',
  TEAM_MEMBER = 'team_member',
}

export const EMPLOYEE_ROLES = [
  { value: EmployeeRole.ADMIN, label: 'Admin' },
  { value: EmployeeRole.MANAGER, label: 'Manager' },
  { value: EmployeeRole.WAREHOUSE, label: 'Warehouse' },
  { value: EmployeeRole.CUSTOMER_SERVICE, label: 'Customer Service' },
];

export const CUSTOMER_ROLES = [
  { value: CustomerRole.MANAGER, label: 'Manager' },
  { value: CustomerRole.TEAM_MEMBER, label: 'Team Member' },
];

export const USER_TYPES = [
  { value: 'employee', label: 'Employee' },
  { value: 'customer', label: 'Customer' },
];

export function getRolesByType(type: 'employee' | 'customer') {
  return type === 'employee' ? EMPLOYEE_ROLES : CUSTOMER_ROLES;
}

export function formatRole(role: string): string {
  return role.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
