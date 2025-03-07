import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('profile/me')
  async getProfile(@Request() req) {
    return this.customerService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Put('profile/me')
  async updateProfile(@Request() req, @Body() data: any) {
    const customer = await this.customerService.findByUserId(req.user.id);
    return this.customerService.update(customer.id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Get('orders/history')
  async getOrderHistory(@Request() req) {
    const customer = await this.customerService.findByUserId(req.user.id);
    return this.customerService.getOrderHistory(customer.id);
  }
}
