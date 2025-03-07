import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CustomerModule } from './customer/customer.module';
import { DishesModule } from './dishes/dishes.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CategoriesModule } from './categories/categories.module';
import { DeliveryPersonsModule } from './delivery-persons/delivery-persons.module';
import { DeliveryFeeModule } from './delivery-fee/delivery-fee.module';
import { DeliveriesModule } from './deliveries/deliveries.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    AdminModule,
    RestaurantModule,
    CustomerModule,
    DishesModule,
    OrdersModule,
    PaymentsModule,
    NotificationsModule,
    CategoriesModule,
    DeliveryPersonsModule,
    DeliveryFeeModule,
    DeliveriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
