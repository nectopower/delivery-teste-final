"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const admin_module_1 = require("./admin/admin.module");
const restaurant_module_1 = require("./restaurant/restaurant.module");
const customer_module_1 = require("./customer/customer.module");
const dishes_module_1 = require("./dishes/dishes.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const notifications_module_1 = require("./notifications/notifications.module");
const categories_module_1 = require("./categories/categories.module");
const delivery_persons_module_1 = require("./delivery-persons/delivery-persons.module");
const delivery_fee_module_1 = require("./delivery-fee/delivery-fee.module");
const deliveries_module_1 = require("./deliveries/deliveries.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            admin_module_1.AdminModule,
            restaurant_module_1.RestaurantModule,
            customer_module_1.CustomerModule,
            dishes_module_1.DishesModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            notifications_module_1.NotificationsModule,
            categories_module_1.CategoriesModule,
            delivery_persons_module_1.DeliveryPersonsModule,
            delivery_fee_module_1.DeliveryFeeModule,
            deliveries_module_1.DeliveriesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map