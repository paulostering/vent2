import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserResponseDto[]> {
    // Only return employee users for admin management
    const users = await this.prisma.user.findMany({
      where: { 
        type: 'EMPLOYEE' 
      },
      include: {
        tenant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(user => this.toResponseDto(user));
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
      },
    });

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tenant: true,
      },
    });

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Get default tenant (in a real app, this would be based on context)
    const tenant = await this.prisma.tenant.findFirst({
      where: { subdomain: 'main' }
    });

    if (!tenant) {
      throw new NotFoundException('Default tenant not found');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const newUser = await this.prisma.user.create({
      data: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        phone: createUserDto.phone,
        passwordHash: hashedPassword,
        type: 'EMPLOYEE', // Always employee for admin-created users
        role: createUserDto.role,
        tenantId: tenant.id,
        isActive: true,
      },
      include: {
        tenant: true,
      },
    });

    return this.toResponseDto(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check for email conflicts if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailConflict = await this.findByEmail(updateUserDto.email);
      if (emailConflict) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Prepare update data
    const updateData: any = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email: updateUserDto.email,
      phone: updateUserDto.phone,
      role: updateUserDto.role,
      isActive: updateUserDto.isActive,
      updatedAt: new Date(),
    };

    // Only update password if provided
    if (updateUserDto.password && updateUserDto.password.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        tenant: true,
      },
    });

    return this.toResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private toResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      type: user.type.toLowerCase(),
      role: user.role,
      tenantId: user.tenantId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
  }
}