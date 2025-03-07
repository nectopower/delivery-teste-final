import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.dish.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: {
        restaurant: true,
        category: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.dish.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.dish.delete({
      where: { id },
    });
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.dish.findMany({
      where: { restaurantId },
      include: {
        category: true,
      },
    });
  }
}
