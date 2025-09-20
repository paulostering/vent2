export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  userCount: number; // Number of users with this role
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  resource: string;
  action: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[]; // Permission IDs
  isActive?: boolean;
}

export enum PermissionCategory {
  USER_MANAGEMENT = 'user_management',
  ORDER_MANAGEMENT = 'order_management',
  CUSTOMER_MANAGEMENT = 'customer_management',
  INVENTORY_MANAGEMENT = 'inventory_management',
  SETTINGS = 'settings',
  REPORTS = 'reports',
}

// Available permissions
export const AVAILABLE_PERMISSIONS: Permission[] = [
  // User Management
  { id: 'users.view', name: 'View Users', description: 'View user list and details', category: PermissionCategory.USER_MANAGEMENT, resource: 'users', action: 'view' },
  { id: 'users.create', name: 'Create Users', description: 'Add new users to the system', category: PermissionCategory.USER_MANAGEMENT, resource: 'users', action: 'create' },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user information and roles', category: PermissionCategory.USER_MANAGEMENT, resource: 'users', action: 'edit' },
  { id: 'users.delete', name: 'Delete Users', description: 'Remove users from the system', category: PermissionCategory.USER_MANAGEMENT, resource: 'users', action: 'delete' },
  
  // Order Management
  { id: 'orders.view', name: 'View Orders', description: 'View order list and details', category: PermissionCategory.ORDER_MANAGEMENT, resource: 'orders', action: 'view' },
  { id: 'orders.create', name: 'Create Orders', description: 'Create new orders', category: PermissionCategory.ORDER_MANAGEMENT, resource: 'orders', action: 'create' },
  { id: 'orders.edit', name: 'Edit Orders', description: 'Modify order information', category: PermissionCategory.ORDER_MANAGEMENT, resource: 'orders', action: 'edit' },
  { id: 'orders.delete', name: 'Delete Orders', description: 'Cancel or remove orders', category: PermissionCategory.ORDER_MANAGEMENT, resource: 'orders', action: 'delete' },
  { id: 'orders.fulfill', name: 'Fulfill Orders', description: 'Process and fulfill orders', category: PermissionCategory.ORDER_MANAGEMENT, resource: 'orders', action: 'fulfill' },
  
  // Customer Management
  { id: 'customers.view', name: 'View Customers', description: 'View customer list and details', category: PermissionCategory.CUSTOMER_MANAGEMENT, resource: 'customers', action: 'view' },
  { id: 'customers.create', name: 'Create Customers', description: 'Add new customers', category: PermissionCategory.CUSTOMER_MANAGEMENT, resource: 'customers', action: 'create' },
  { id: 'customers.edit', name: 'Edit Customers', description: 'Modify customer information', category: PermissionCategory.CUSTOMER_MANAGEMENT, resource: 'customers', action: 'edit' },
  { id: 'customers.delete', name: 'Delete Customers', description: 'Remove customers', category: PermissionCategory.CUSTOMER_MANAGEMENT, resource: 'customers', action: 'delete' },
  
  // Inventory Management
  { id: 'inventory.view', name: 'View Inventory', description: 'View inventory levels and products', category: PermissionCategory.INVENTORY_MANAGEMENT, resource: 'inventory', action: 'view' },
  { id: 'inventory.create', name: 'Create Products', description: 'Add new products to inventory', category: PermissionCategory.INVENTORY_MANAGEMENT, resource: 'inventory', action: 'create' },
  { id: 'inventory.edit', name: 'Edit Inventory', description: 'Modify inventory levels and products', category: PermissionCategory.INVENTORY_MANAGEMENT, resource: 'inventory', action: 'edit' },
  { id: 'inventory.delete', name: 'Delete Products', description: 'Remove products from inventory', category: PermissionCategory.INVENTORY_MANAGEMENT, resource: 'inventory', action: 'delete' },
  
  // Settings
  { id: 'settings.view', name: 'View Settings', description: 'Access system settings', category: PermissionCategory.SETTINGS, resource: 'settings', action: 'view' },
  { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system configuration', category: PermissionCategory.SETTINGS, resource: 'settings', action: 'edit' },
  { id: 'roles.manage', name: 'Manage Roles', description: 'Create and edit user roles', category: PermissionCategory.SETTINGS, resource: 'roles', action: 'manage' },
  
  // Reports
  { id: 'reports.view', name: 'View Reports', description: 'Access system reports', category: PermissionCategory.REPORTS, resource: 'reports', action: 'view' },
  { id: 'reports.export', name: 'Export Reports', description: 'Export reports to various formats', category: PermissionCategory.REPORTS, resource: 'reports', action: 'export' },
];

export const PERMISSION_CATEGORIES = [
  { value: PermissionCategory.USER_MANAGEMENT, label: 'User Management' },
  { value: PermissionCategory.ORDER_MANAGEMENT, label: 'Order Management' },
  { value: PermissionCategory.CUSTOMER_MANAGEMENT, label: 'Customer Management' },
  { value: PermissionCategory.INVENTORY_MANAGEMENT, label: 'Inventory Management' },
  { value: PermissionCategory.SETTINGS, label: 'Settings' },
  { value: PermissionCategory.REPORTS, label: 'Reports' },
];

export function getPermissionsByCategory(category: PermissionCategory): Permission[] {
  return AVAILABLE_PERMISSIONS.filter(permission => permission.category === category);
}

export function formatPermissionCategory(category: PermissionCategory): string {
  return category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
