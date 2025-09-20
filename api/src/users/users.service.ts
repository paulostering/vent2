import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { User, EmployeeRole, CustomerRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  // Mock users for demo - replace with actual database integration
  private users: User[] = [
    {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '+1 (555) 123-0001',
      passwordHash: bcrypt.hashSync('password123', 10),
      tenantId: 'tenant-1',
      type: 'employee',
      role: EmployeeRole.ADMIN,
      isActive: true,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
      lastLogin: new Date('2024-01-20T14:30:00Z'),
    },
    {
      id: '2',
      firstName: 'Customer',
      lastName: 'Manager',
      email: 'customer@example.com',
      phone: '+1 (555) 123-0002',
      passwordHash: bcrypt.hashSync('password123', 10),
      tenantId: 'tenant-2',
      type: 'customer',
      role: CustomerRole.MANAGER,
      isActive: true,
      createdAt: new Date('2024-01-16T11:00:00Z'),
      updatedAt: new Date('2024-01-16T11:00:00Z'),
      lastLogin: new Date('2024-01-19T09:15:00Z'),
    },
    {
      id: '3',
      firstName: 'Warehouse',
      lastName: 'Staff',
      email: 'warehouse@example.com',
      phone: '+1 (555) 123-0003',
      passwordHash: bcrypt.hashSync('password123', 10),
      tenantId: 'tenant-1',
      type: 'employee',
      role: EmployeeRole.WAREHOUSE,
      isActive: true,
      createdAt: new Date('2024-01-17T09:00:00Z'),
      updatedAt: new Date('2024-01-17T09:00:00Z'),
      lastLogin: new Date('2024-01-18T08:45:00Z'),
    },
    {
      id: '4',
      firstName: 'Support',
      lastName: 'Agent',
      email: 'support@example.com',
      phone: '+1 (555) 123-0004',
      passwordHash: bcrypt.hashSync('password123', 10),
      tenantId: 'tenant-1',
      type: 'employee',
      role: EmployeeRole.CUSTOMER_SERVICE,
      isActive: false,
      createdAt: new Date('2024-01-10T15:00:00Z'),
      updatedAt: new Date('2024-01-18T16:30:00Z'),
    },
  ];

  async findAll(): Promise<UserResponseDto[]> {
    // Only return employee users for admin management
    return this.users
      .filter(user => user.type === 'employee')
      .map(user => this.toResponseDto(user));
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const newUser: User = {
      id: Date.now().toString(), // In real app, use UUID
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      passwordHash: hashedPassword,
      type: createUserDto.type,
      role: createUserDto.role,
      tenantId: createUserDto.tenantId || 'tenant-1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return this.toResponseDto(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return this.toResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(userIndex, 1);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private toResponseDto(user: User): UserResponseDto {
    const { passwordHash, ...userResponse } = user;
    return userResponse;
  }
}

