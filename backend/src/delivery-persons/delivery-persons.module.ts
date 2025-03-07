import { Module } from '@nestjs/common';
import { DeliveryPersonsService } from './delivery-persons.service';
import { DeliveryPersonsController } from './delivery-persons.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryPersonsController],
  providers: [DeliveryPersonsService],
  exports: [DeliveryPersonsService]
})
export class DeliveryPersonsModule {}
