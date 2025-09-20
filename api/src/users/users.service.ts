import { Injectable } from '@nestjs/common';
import { User, EmployeeRole, CustomerRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  // Mock users for demo - replace with actual database integration
  private readonly users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      passwordHash: bcrypt.hashSync('password123', 10),
      tenantId: 'tenant-1',
      type: 'employee',
      role: EmployeeRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      email: 'customer@example.com',
      passwordHash: bcrypt.hashSync('password123', 10),
      tenantId: 'tenant-2',
      type: 'customer',
      role: CustomerRole.MANAGER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
