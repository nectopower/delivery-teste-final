import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(userData: any) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
      },
    });

    // Create related profile based on role
    if (userData.role === 'CUSTOMER') {
      await this.prisma.customer.create({
        data: {
          userId: user.id,
          address: userData.address,
          phone: userData.phone,
        },
      });
    } else if (userData.role === 'RESTAURANT') {
      await this.prisma.restaurant.create({
        data: {
          userId: user.id,
          name: userData.restaurantName || userData.name,
          description: userData.description,
          address: userData.address,
          phone: userData.phone,
          logo: userData.logo,
        },
      });
    } else if (userData.role === 'ADMIN') {
      await this.prisma.admin.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Return JWT token
    const { password, ...result } = user;
    return this.login(result);
  }
}
