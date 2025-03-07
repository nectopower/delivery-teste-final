import { Module } from '@nestjs/common';
import { DeliveryFeeService } from './delivery-fee.service';
import { DeliveryFeeController } from './delivery-fee.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryFeeController],
  providers: [DeliveryFeeService],
  exports: [DeliveryFeeService]
})
export class DeliveryFeeModule {}
