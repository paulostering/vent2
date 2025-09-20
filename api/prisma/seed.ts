import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'main' },
    update: {},
    create: {
      name: 'Main Organization',
      subdomain: 'main',
      settings: {
        theme: 'default',
        features: ['user_management', 'role_management'],
      },
    },
  });

  console.log('Created tenant:', tenant);

  // Create initial users
  const users = [
    {
      firstName: 'Paul',
      lastName: 'Sterling',
      email: 'paul@admin.com',
      phone: '+1 (555) 123-0001',
      role: 'admin',
    },
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '+1 (555) 123-0002',
      role: 'admin',
    },
    {
      firstName: 'Manager',
      lastName: 'Smith',
      email: 'manager@example.com',
      phone: '+1 (555) 123-0003',
      role: 'manager',
    },
    {
      firstName: 'Warehouse',
      lastName: 'Staff',
      email: 'warehouse@example.com',
      phone: '+1 (555) 123-0004',
      role: 'warehouse',
    },
    {
      firstName: 'Support',
      lastName: 'Agent',
      email: 'support@example.com',
      phone: '+1 (555) 123-0005',
      role: 'customer_service',
    },
  ];

  const hashedPassword = await bcrypt.hash('password123', 10);

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        passwordHash: hashedPassword,
        tenantId: tenant.id,
        type: UserType.EMPLOYEE,
        role: userData.role,
        isActive: true,
      },
    });
    console.log('Created user:', user.email);
  }

  // Create customer user
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      firstName: 'Customer',
      lastName: 'Manager',
      email: 'customer@example.com',
      phone: '+1 (555) 123-0010',
      passwordHash: hashedPassword,
      tenantId: tenant.id,
      type: UserType.CUSTOMER,
      role: 'manager',
      isActive: true,
    },
  });
  console.log('Created customer user:', customerUser.email);

  // Create default roles
  const roles = [
    {
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: ['*'], // All permissions
    },
    {
      name: 'Manager',
      description: 'Management access with order and customer permissions',
      permissions: ['orders.*', 'customers.*', 'reports.*'],
    },
    {
      name: 'Warehouse',
      description: 'Warehouse operations and inventory management',
      permissions: ['inventory.*', 'orders.fulfill'],
    },
    {
      name: 'Customer Service',
      description: 'Customer support and order assistance',
      permissions: ['customers.*', 'orders.view', 'orders.edit'],
    },
  ];

  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
        isActive: true,
        userCount: 0, // Will be updated by application logic
      },
    });
    console.log('Created role:', role.name);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
