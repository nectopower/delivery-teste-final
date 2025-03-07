import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.customer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async getOrderHistory(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        restaurant: {
          select: {
            name: true,
            logo: true,
          },
        },
        items: {
          include: {
            dish: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
