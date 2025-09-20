import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Role, Permission, PermissionCategory } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';

// Available permissions
const AVAILABLE_PERMISSIONS: Permission[] = [
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

@Injectable()
export class RolesService {
  // Mock roles for demo - replace with actual database integration
  private roles: Role[] = [
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: AVAILABLE_PERMISSIONS,
      isActive: true,
      userCount: 1,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Management access with order and customer permissions',
      permissions: AVAILABLE_PERMISSIONS.filter(p => 
        p.category === PermissionCategory.ORDER_MANAGEMENT ||
        p.category === PermissionCategory.CUSTOMER_MANAGEMENT ||
        p.category === PermissionCategory.REPORTS
      ),
      isActive: true,
      userCount: 1,
      createdAt: new Date('2024-01-16T11:00:00Z'),
      updatedAt: new Date('2024-01-16T11:00:00Z'),
    },
    {
      id: '3',
      name: 'Warehouse',
      description: 'Warehouse operations and inventory management',
      permissions: AVAILABLE_PERMISSIONS.filter(p => 
        p.category === PermissionCategory.INVENTORY_MANAGEMENT ||
        (p.category === PermissionCategory.ORDER_MANAGEMENT && p.action === 'fulfill')
      ),
      isActive: true,
      userCount: 1,
      createdAt: new Date('2024-01-17T09:00:00Z'),
      updatedAt: new Date('2024-01-17T09:00:00Z'),
    },
    {
      id: '4',
      name: 'Customer Service',
      description: 'Customer support and order assistance',
      permissions: AVAILABLE_PERMISSIONS.filter(p => 
        p.category === PermissionCategory.CUSTOMER_MANAGEMENT ||
        (p.category === PermissionCategory.ORDER_MANAGEMENT && p.action !== 'delete')
      ),
      isActive: false,
      userCount: 1,
      createdAt: new Date('2024-01-10T15:00:00Z'),
      updatedAt: new Date('2024-01-18T16:30:00Z'),
    },
  ];

  async findAll(): Promise<RoleResponseDto[]> {
    return this.roles.map(role => this.toResponseDto(role));
  }

  async findById(id: string): Promise<Role | undefined> {
    return this.roles.find(role => role.id === id);
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    // Check if role name already exists
    const existingRole = this.roles.find(role => 
      role.name.toLowerCase() === createRoleDto.name.toLowerCase()
    );
    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    // Get permissions by IDs
    const permissions = AVAILABLE_PERMISSIONS.filter(p => 
      createRoleDto.permissions.includes(p.id)
    );
    
    const newRole: Role = {
      id: Date.now().toString(),
      name: createRoleDto.name,
      description: createRoleDto.description,
      permissions,
      isActive: true,
      userCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.roles.push(newRole);
    return this.toResponseDto(newRole);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const roleIndex = this.roles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      throw new NotFoundException('Role not found');
    }

    const existingRole = this.roles[roleIndex];
    
    // Check for name conflicts if name is being updated
    if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
      const nameConflict = this.roles.find(role => 
        role.id !== id && role.name.toLowerCase() === updateRoleDto.name!.toLowerCase()
      );
      if (nameConflict) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    // Get permissions by IDs if provided
    let permissions = existingRole.permissions;
    if (updateRoleDto.permissions) {
      permissions = AVAILABLE_PERMISSIONS.filter(p => 
        updateRoleDto.permissions!.includes(p.id)
      );
    }

    const updatedRole = {
      ...existingRole,
      ...updateRoleDto,
      permissions,
      updatedAt: new Date(),
    };

    this.roles[roleIndex] = updatedRole;
    return this.toResponseDto(updatedRole);
  }

  async remove(id: string): Promise<void> {
    const roleIndex = this.roles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      throw new NotFoundException('Role not found');
    }

    const role = this.roles[roleIndex];
    if (role.userCount > 0) {
      throw new ConflictException('Cannot delete role that is assigned to users');
    }

    this.roles.splice(roleIndex, 1);
  }

  getAvailablePermissions(): Permission[] {
    return AVAILABLE_PERMISSIONS;
  }

  private toResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive,
      userCount: role.userCount,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
