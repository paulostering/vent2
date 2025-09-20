import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ user: any; accessToken: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      type: user.type.toLowerCase() as 'employee' | 'customer',
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h', // Adjust as needed for HIPAA compliance
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        type: user.type.toLowerCase(),
        role: user.role,
        tenantId: user.tenantId,
      },
      accessToken,
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  generateCookieOptions() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const cookieDomain = this.configService.get('COOKIE_DOMAIN');
    
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      // Only set domain in production or when explicitly configured
      domain: isProduction && cookieDomain ? cookieDomain : undefined,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    };
  }
}
