import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('dishes')
export class DishesController {
  constructor(private dishesService: DishesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT')
  @Post()
  async create(@Body() data: any) {
    return this.dishesService.create(data);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.dishesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT')
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.dishesService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.dishesService.remove(id);
  }

  @Get('restaurant/:restaurantId')
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.dishesService.findByRestaurant(restaurantId);
  }
}
