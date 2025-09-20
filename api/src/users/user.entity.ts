export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  tenantId: string;
  type: 'employee' | 'customer';
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  tenantId: string;
  type: 'employee' | 'customer';
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

