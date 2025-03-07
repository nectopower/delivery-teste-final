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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const orders = await this.prisma.order.findMany();
        const orderStats = {
            PENDING: orders.filter(order => order.status === 'PENDING').length,
            ACCEPTED: orders.filter(order => order.status === 'ACCEPTED').length,
            PREPARING: orders.filter(order => order.status === 'PREPARING').length,
            READY_FOR_PICKUP: orders.filter(order => order.status === 'READY_FOR_PICKUP').length,
            OUT_FOR_DELIVERY: orders.filter(order => order.status === 'OUT_FOR_DELIVERY').length,
            DELIVERED: orders.filter(order => order.status === 'DELIVERED').length,
            CANCELLED: orders.filter(order => order.status === 'CANCELLED').length,
        };
        const users = await this.prisma.user.findMany();
        const userStats = {
            ADMIN: users.filter(user => user.role === 'ADMIN').length,
            RESTAURANT: users.filter(user => user.role === 'RESTAURANT').length,
            CUSTOMER: users.filter(user => user.role === 'CUSTOMER').length,
        };
        const restaurants = await this.prisma.restaurant.findMany();
        const approvedRestaurants = restaurants.filter(r => r.isApproved).length;
        const pendingRestaurants = restaurants.filter(r => !r.isApproved).length;
        const payments = await this.prisma.payment.findMany();
        const totalRevenue = payments
            .filter(payment => payment.status === 'COMPLETED')
            .reduce((sum, payment) => sum + payment.amount, 0);
        return {
            orderStats,
            userStats,
            restaurantStats: {
                total: restaurants.length,
                approved: approvedRestaurants,
                pending: pendingRestaurants,
            },
            paymentStats: {
                totalRevenue,
            },
        };
    }
    async approveRestaurant(id) {
        return this.prisma.restaurant.update({
            where: { id },
            data: { isApproved: true },
        });
    }
    async rejectRestaurant(id) {
        return this.prisma.restaurant.update({
            where: { id },
            data: { isApproved: false },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map