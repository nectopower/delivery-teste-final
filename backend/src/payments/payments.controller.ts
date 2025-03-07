import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: any) {
    return this.paymentsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  async findByOrderId(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: string },
  ) {
    return this.paymentsService.updateStatus(id, data.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('stats/overview')
  async getPaymentStats() {
    return this.paymentsService.getPaymentStats();
  }
}
