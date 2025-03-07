import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesController } from './deliveries.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DeliveryFeeModule } from '../delivery-fee/delivery-fee.module';

@Module({
  imports: [PrismaModule, DeliveryFeeModule],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  exports: [DeliveriesService]
})
export class DeliveriesModule {}
