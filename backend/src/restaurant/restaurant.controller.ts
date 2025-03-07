import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.restaurantService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createRestaurantDto: any) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateRestaurantDto: any) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.restaurantService.delete(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  approveRestaurant(@Param('id') id: string, @Body() data: { isApproved: boolean }) {
    return this.restaurantService.updateApprovalStatus(id, data.isApproved);
  }

  @Get(':id/dishes')
  @UseGuards(JwtAuthGuard)
  getRestaurantDishes(@Param('id') id: string) {
    // Implementar lógica para buscar pratos do restaurante
    return [];
  }

  @Get(':id/reviews')
  @UseGuards(JwtAuthGuard)
  getRestaurantReviews(@Param('id') id: string) {
    // Implementar lógica para buscar avaliações do restaurante
    return [];
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  rateRestaurant(
    @Param('id') id: string,
    @Body() ratingData: { 
      rating: number; 
      comment?: string;
      commentType?: 'praise' | 'criticism';
    },
  ) {
    // Validar o tamanho do comentário
    if (ratingData.comment && ratingData.comment.length > 140) {
      throw new Error('O comentário deve ter no máximo 140 caracteres');
    }
    
    // Implementar lógica para salvar avaliação do restaurante
    return { success: true, message: 'Avaliação registrada com sucesso' };
  }
}
