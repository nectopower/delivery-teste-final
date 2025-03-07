"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryPersonsModule = void 0;
const common_1 = require("@nestjs/common");
const delivery_persons_service_1 = require("./delivery-persons.service");
const delivery_persons_controller_1 = require("./delivery-persons.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let DeliveryPersonsModule = class DeliveryPersonsModule {
};
exports.DeliveryPersonsModule = DeliveryPersonsModule;
exports.DeliveryPersonsModule = DeliveryPersonsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [delivery_persons_controller_1.DeliveryPersonsController],
        providers: [delivery_persons_service_1.DeliveryPersonsService],
        exports: [delivery_persons_service_1.DeliveryPersonsService]
    })
], DeliveryPersonsModule);
//# sourceMappingURL=delivery-persons.module.js.map