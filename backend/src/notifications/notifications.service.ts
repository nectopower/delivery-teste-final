import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createOrderNotification(orderId: string, status: string) {
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

    // Simular envio de notificação
    if (order.customer && order.customer.user && order.customer.user.email) {
      console.log(`Notificação enviada para ${order.customer.user.email}: Seu pedido está ${status}`);
    }

    // Criar registro de notificação no banco de dados
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

  async createPaymentNotification(paymentId: string, status: string) {
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

    // Simular envio de notificação
    if (payment.order && payment.order.customer && payment.order.customer.user && payment.order.customer.user.email) {
      console.log(`Notificação de pagamento enviada para ${payment.order.customer.user.email}: Seu pagamento está ${status}`);
    }

    // Criar registro de notificação no banco de dados
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

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async getUnreadByUser(userId: string) {
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

  async getAllByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
