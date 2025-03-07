"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryFeeModule = void 0;
const common_1 = require("@nestjs/common");
const delivery_fee_service_1 = require("./delivery-fee.service");
const delivery_fee_controller_1 = require("./delivery-fee.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let DeliveryFeeModule = class DeliveryFeeModule {
};
exports.DeliveryFeeModule = DeliveryFeeModule;
exports.DeliveryFeeModule = DeliveryFeeModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [delivery_fee_controller_1.DeliveryFeeController],
        providers: [delivery_fee_service_1.DeliveryFeeService],
        exports: [delivery_fee_service_1.DeliveryFeeService]
    })
], DeliveryFeeModule);
//# sourceMappingURL=delivery-fee.module.js.map