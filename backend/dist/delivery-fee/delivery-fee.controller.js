"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryFeeController = void 0;
const common_1 = require("@nestjs/common");
const delivery_fee_service_1 = require("./delivery-fee.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let DeliveryFeeController = class DeliveryFeeController {
    constructor(deliveryFeeService) {
        this.deliveryFeeService = deliveryFeeService;
    }
    async getConfig() {
        return this.deliveryFeeService.getConfig();
    }
    async updateConfig(data) {
        return this.deliveryFeeService.updateConfig(data);
    }
    async calculateFee(data) {
        return {
            fee: await this.deliveryFeeService.calculateDeliveryFee(data.distance),
            estimatedTime: await this.deliveryFeeService.getDeliveryTimeEstimate(data.distance)
        };
    }
};
exports.DeliveryFeeController = DeliveryFeeController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeliveryFeeController.prototype, "getConfig", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Put)('config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryFeeController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeliveryFeeController.prototype, "calculateFee", null);
exports.DeliveryFeeController = DeliveryFeeController = __decorate([
    (0, common_1.Controller)('delivery-fee'),
    __metadata("design:paramtypes", [delivery_fee_service_1.DeliveryFeeService])
], DeliveryFeeController);
//# sourceMappingURL=delivery-fee.controller.js.map