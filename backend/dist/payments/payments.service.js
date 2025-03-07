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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const order = await this.prisma.order.findUnique({
            where: { id: data.orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${data.orderId} not found`);
        }
        const existingPayment = await this.prisma.payment.findMany({
            where: { orderId: data.orderId },
        });
        if (existingPayment.length > 0) {
            throw new Error(`Payment already exists for order ${data.orderId}`);
        }
        return this.prisma.payment.create({
            data: {
                amount: data.amount,
                provider: data.provider || 'MERCADO_PAGO',
                externalId: data.externalId,
                orderId: data.orderId,
            },
        });
    }
    async findAll() {
        return this.prisma.payment.findMany({
            include: {
                order: {
                    include: {
                        customer: {
                            include: {
                                user: true,
                            },
                        },
                        restaurant: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        customer: {
                            include: {
                                user: true,
                            },
                        },
                        restaurant: true,
                        items: {
                            include: {
                                dish: true,
                            },
                        },
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }
    async findById(id) {
        return this.findOne(id);
    }
    async findByOrder(orderId) {
        const payments = await this.prisma.payment.findMany({
            where: { orderId },
            include: {
                order: {
                    include: {
                        customer: {
                            include: {
                                user: true,
                            },
                        },
                        restaurant: true,
                        items: {
                            include: {
                                dish: true,
                            },
                        },
                    },
                },
            },
        });
        const payment = payments.length > 0 ? payments[0] : null;
        if (!payment) {
            throw new common_1.NotFoundException(`Payment for order ID ${orderId} not found`);
        }
        return payment;
    }
    async update(id, data) {
        return this.prisma.payment.update({
            where: { id },
            data,
        });
    }
    async updateStatus(id, status) {
        return this.prisma.payment.update({
            where: { id },
            data: { status },
        });
    }
    async processPayment(id) {
        const payment = await this.update(id, { status: 'COMPLETED' });
        if (payment.status === 'COMPLETED') {
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'ACCEPTED' },
            });
        }
        return payment;
    }
    async getPaymentStats() {
        const payments = await this.prisma.payment.findMany();
        const completedPayments = payments.filter(p => p.status === 'COMPLETED').length;
        const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
        const failedPayments = payments.filter(p => p.status === 'FAILED').length;
        const totalRevenue = payments
            .filter(p => p.status === 'COMPLETED')
            .reduce((sum, payment) => sum + payment.amount, 0);
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        const recentPayments = payments.filter(p => p.status === 'COMPLETED' && new Date(p.createdAt) >= sixMonthsAgo);
        const revenueByMonth = {};
        for (let i = 0; i < 6; i++) {
            const month = new Date();
            month.setMonth(now.getMonth() - i);
            const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
            revenueByMonth[monthKey] = 0;
        }
        for (const payment of recentPayments) {
            const date = new Date(payment.createdAt);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (revenueByMonth[monthKey] !== undefined) {
                revenueByMonth[monthKey] += payment.amount;
            }
        }
        return {
            totalRevenue,
            completedPayments,
            pendingPayments,
            failedPayments,
            revenueByMonth: Object.entries(revenueByMonth).map(([month, amount]) => ({
                month,
                amount,
            })),
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map