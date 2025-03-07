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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryFeeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DeliveryFeeService = class DeliveryFeeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConfig() {
        const config = await this.prisma.deliveryFeeConfig.findFirst();
        if (!config) {
            return this.prisma.deliveryFeeConfig.create({
                data: {
                    basePrice: 5.0,
                    pricePerKm: 1.5,
                    rushHourMultiplier: 1.5,
                    rushHourStart: 17,
                    rushHourEnd: 21,
                    nightFeeMultiplier: 1.2,
                    nightFeeStart: 22,
                    nightFeeEnd: 6,
                },
            });
        }
        return config;
    }
    async updateConfig(data) {
        const config = await this.getConfig();
        return this.prisma.deliveryFeeConfig.update({
            where: { id: config.id },
            data,
        });
    }
    async calculateDeliveryFee(distance) {
        const config = await this.getConfig();
        let fee = config.basePrice + (distance * config.pricePerKm);
        const currentHour = new Date().getHours();
        if ((config.rushHourStart <= config.rushHourEnd &&
            currentHour >= config.rushHourStart &&
            currentHour < config.rushHourEnd) ||
            (config.rushHourStart > config.rushHourEnd &&
                (currentHour >= config.rushHourStart ||
                    currentHour < config.rushHourEnd))) {
            fee *= config.rushHourMultiplier;
        }
        if ((config.nightFeeStart <= config.nightFeeEnd &&
            currentHour >= config.nightFeeStart &&
            currentHour < config.nightFeeEnd) ||
            (config.nightFeeStart > config.nightFeeEnd &&
                (currentHour >= config.nightFeeStart ||
                    currentHour < config.nightFeeEnd))) {
            fee *= config.nightFeeMultiplier;
        }
        return Math.round(fee * 100) / 100;
    }
    async getDeliveryTimeEstimate(distance) {
        const baseTime = 10;
        const timePerKm = 5;
        let estimatedTime = baseTime + (distance * timePerKm);
        const config = await this.getConfig();
        const currentHour = new Date().getHours();
        if ((config.rushHourStart <= config.rushHourEnd &&
            currentHour >= config.rushHourStart &&
            currentHour < config.rushHourEnd) ||
            (config.rushHourStart > config.rushHourEnd &&
                (currentHour >= config.rushHourStart ||
                    currentHour < config.rushHourEnd))) {
            estimatedTime *= 1.3;
        }
        return Math.round(estimatedTime);
    }
};
exports.DeliveryFeeService = DeliveryFeeService;
exports.DeliveryFeeService = DeliveryFeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliveryFeeService);
//# sourceMappingURL=delivery-fee.service.js.map