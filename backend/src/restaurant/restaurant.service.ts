import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.restaurant.findMany({
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

  async findById(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        dishes: {
          include: {
            category: true,
          },
        },
        categories: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.restaurant.findUnique({
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

  async create(data: any) {
    return this.prisma.restaurant.create({
      data,
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
    return this.prisma.restaurant.update({
      where: { id },
      data,
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

  async delete(id: string) {
    return this.prisma.restaurant.delete({
      where: { id },
    });
  }

  async updateApprovalStatus(id: string, isApproved: boolean) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isApproved },
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
}
