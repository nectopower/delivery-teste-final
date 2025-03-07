import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; restaurantId: string }) {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll(restaurantId?: string) {
    if (restaurantId) {
      return this.prisma.category.findMany({
        where: { restaurantId },
      });
    }
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.category.findMany({
      where: { restaurantId },
    });
  }

  async update(id: string, data: { name: string }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // First, update all dishes in this category to have no category
    const dishes = await this.prisma.dish.findMany({
      where: { categoryId: id },
    });
    
    // Update each dish individually to remove the category
    for (const dish of dishes) {
      await this.prisma.dish.update({
        where: { id: dish.id },
        data: { categoryId: null },
      });
    }

    // Then delete the category
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
