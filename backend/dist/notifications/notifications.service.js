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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrderNotification(orderId, status) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                customer: {
                    include: {
                        user: true,
                    },
                },
                restaurant: true,
            },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        let message = '';
        let type = '';
        switch (status) {
            case 'ACCEPTED':
                message = `Seu pedido foi aceito pelo restaurante ${order.restaurant?.name || 'desconhecido'}`;
                type = 'ORDER_ACCEPTED';
                break;
            case 'PREPARING':
                message = `Seu pedido está sendo preparado pelo restaurante ${order.restaurant?.name || 'desconhecido'}`;
                type = 'ORDER_PREPARING';
                break;
            case 'READY_FOR_PICKUP':
                message = `Seu pedido está pronto para retirada no restaurante ${order.restaurant?.name || 'desconhecido'}`;
                type = 'ORDER_READY';
                break;
            case 'OUT_FOR_DELIVERY':
                message = `Seu pedido saiu para entrega do restaurante ${order.restaurant?.name || 'desconhecido'}`;
                type = 'ORDER_OUT_FOR_DELIVERY';
                break;
            case 'DELIVERED':
                message = `Seu pedido foi entregue. Bom apetite!`;
                type = 'ORDER_DELIVERED';
                break;
            case 'CANCELLED':
                message = `Seu pedido foi cancelado pelo restaurante ${order.restaurant?.name || 'desconhecido'}`;
                type = 'ORDER_CANCELLED';
                break;
        }
        if (order.customer && order.customer.user && order.customer.user.email) {
            console.log(`Notificação enviada para ${order.customer.user.email}: Seu pedido está ${status}`);
        }
        return this.prisma.notification.create({
            data: {
                type,
                message,
                recipientId: order.customer && order.customer.userId ? order.customer.userId : 'unknown',
                read: false,
                data: {
                    orderId: order.id,
                    status,
                },
            },
        });
    }
    async createPaymentNotification(paymentId, status) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                order: {
                    include: {
                        customer: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
        if (!payment) {
            throw new Error('Payment not found');
        }
        let message = '';
        let type = '';
        switch (status) {
            case 'COMPLETED':
                message = `Seu pagamento de R$${payment.amount.toFixed(2)} foi confirmado`;
                type = 'PAYMENT_COMPLETED';
                break;
            case 'FAILED':
                message = `Seu pagamento de R$${payment.amount.toFixed(2)} falhou. Por favor, tente novamente`;
                type = 'PAYMENT_FAILED';
                break;
            case 'REFUNDED':
                message = `Seu pagamento de R$${payment.amount.toFixed(2)} foi reembolsado`;
                type = 'PAYMENT_REFUNDED';
                break;
        }
        if (payment.order && payment.order.customer && payment.order.customer.user && payment.order.customer.user.email) {
            console.log(`Notificação de pagamento enviada para ${payment.order.customer.user.email}: Seu pagamento está ${status}`);
        }
        return this.prisma.notification.create({
            data: {
                type,
                message,
                recipientId: payment.order && payment.order.customer ? payment.order.customer.userId : 'unknown',
                read: false,
                data: {
                    paymentId: payment.id,
                    status,
                },
            },
        });
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async getUnreadByUser(userId) {
        return this.prisma.notification.findMany({
            where: {
                recipientId: userId,
                read: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getAllByUser(userId) {
        return this.prisma.notification.findMany({
            where: {
                recipientId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map