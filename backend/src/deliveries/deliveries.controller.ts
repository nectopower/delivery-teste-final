import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrderStatus } from '../prisma/prisma.service';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'RESTAURANT')
  @Post()
  async create(@Body() data: { orderId: string; distance: number }) {
    return this.deliveriesService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: OrderStatus,
    @Query('deliveryPersonId') deliveryPersonId?: string,
  ) {
    return this.deliveriesService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      deliveryPersonId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON')
  @Put(':id/assign')
  async assignDeliveryPerson(
    @Param('id') id: string,
    @Body() data: { deliveryPersonId: string },
  ) {
    return this.deliveriesService.assignDeliveryPerson(id, data.deliveryPersonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON', 'RESTAURANT')
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: OrderStatus },
  ) {
    return this.deliveriesService.updateStatus(id, data.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Put(':id/rate')
  async rateDelivery(
    @Param('id') id: string,
    @Body() data: { rating: number; feedback?: string },
  ) {
    return this.deliveriesService.rateDelivery(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DELIVERY_PERSON')
  @Get('pending/list')
  async getPendingDeliveries() {
    return this.deliveriesService.getPendingDeliveries();
  }
}
