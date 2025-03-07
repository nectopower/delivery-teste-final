import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { DeliveryFeeService } from './delivery-fee.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('delivery-fee')
export class DeliveryFeeController {
  constructor(private deliveryFeeService: DeliveryFeeService) {}

  @Get('config')
  async getConfig() {
    return this.deliveryFeeService.getConfig();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('config')
  async updateConfig(@Body() data: {
    basePrice?: number;
    pricePerKm?: number;
    rushHourMultiplier?: number;
    rushHourStart?: number;
    rushHourEnd?: number;
    nightFeeMultiplier?: number;
    nightFeeStart?: number;
    nightFeeEnd?: number;
  }) {
    return this.deliveryFeeService.updateConfig(data);
  }

  @Get('calculate')
  async calculateFee(
    @Body() data: { distance: number; orderTime?: string }
  ) {
    // Não passamos o orderTime para os métodos, pois eles não aceitam esse parâmetro
    return {
      fee: await this.deliveryFeeService.calculateDeliveryFee(data.distance),
      estimatedTime: await this.deliveryFeeService.getDeliveryTimeEstimate(data.distance)
    };
  }
}
