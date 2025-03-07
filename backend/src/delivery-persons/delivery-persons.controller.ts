import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { DeliveryPersonsService } from './delivery-persons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { VehicleType, DeliveryPersonStatus } from '../prisma/prisma.service';

@Controller('delivery-persons')
export class DeliveryPersonsController {
  constructor(private readonly deliveryPersonsService: DeliveryPersonsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() data: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone: string;
    vehicleType: VehicleType;
    vehiclePlate?: string;
  }) {
    return this.deliveryPersonsService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: DeliveryPersonStatus,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    return this.deliveryPersonsService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      isActive: isActive ? isActive === 'true' : undefined,
      search,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deliveryPersonsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      phone?: string;
      vehicleType?: VehicleType;
      vehiclePlate?: string;
      status?: DeliveryPersonStatus;
      isActive?: boolean;
    },
  ) {
    return this.deliveryPersonsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DELIVERY_PERSON')
  @Put(':id/location')
  async updateLocation(
    @Param('id') id: string,
    @Body() data: { latitude: number; longitude: number },
  ) {
    return this.deliveryPersonsService.updateLocation(id, data.latitude, data.longitude);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DELIVERY_PERSON')
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: DeliveryPersonStatus },
  ) {
    return this.deliveryPersonsService.updateStatus(id, data.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deliveryPersonsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  async getDeliveryStats(@Param('id') id: string) {
    return this.deliveryPersonsService.getDeliveryStats(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RESTAURANT')
  @Get('available/nearby')
  async getAvailableDeliveryPersons(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    return this.deliveryPersonsService.getAvailableDeliveryPersons(
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }
}
