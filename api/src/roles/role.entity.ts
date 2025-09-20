export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  resource: string;
  action: string;
}

export enum PermissionCategory {
  USER_MANAGEMENT = 'user_management',
  ORDER_MANAGEMENT = 'order_management',
  CUSTOMER_MANAGEMENT = 'customer_management',
  INVENTORY_MANAGEMENT = 'inventory_management',
  SETTINGS = 'settings',
  REPORTS = 'reports',
}
