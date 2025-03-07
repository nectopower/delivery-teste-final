import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    amount: number;
    orderId: string;
    provider?: string;
    externalId?: string;
  }) {
    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${data.orderId} not found`);
    }

    // Check if payment already exists for this order
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

  async findOne(id: string) {
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
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async findById(id: string) {
    return this.findOne(id);
  }

  async findByOrder(orderId: string) {
    // Substituindo findFirst por findMany e pegando o primeiro resultado
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
      throw new NotFoundException(`Payment for order ID ${orderId} not found`);
    }

    return payment;
  }

  async update(id: string, data: {
    status?: string;
    externalId?: string;
  }) {
    return this.prisma.payment.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.payment.update({
      where: { id },
      data: { status },
    });
  }

  async processPayment(id: string) {
    // In a real app, this would integrate with a payment gateway
    // For now, we'll just mark the payment as completed
    const payment = await this.update(id, { status: 'COMPLETED' });

    // Update the order status if payment is successful
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
    
    // Count payments by status
    const completedPayments = payments.filter(p => p.status === 'COMPLETED').length;
    const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
    const failedPayments = payments.filter(p => p.status === 'FAILED').length;
    
    // Calculate total revenue from completed payments
    const totalRevenue = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Get revenue by month (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const recentPayments = payments.filter(
      p => p.status === 'COMPLETED' && new Date(p.createdAt) >= sixMonthsAgo
    );

    const revenueByMonth = {};
    
    // Initialize all months with 0
    for (let i = 0; i < 6; i++) {
      const month = new Date();
      month.setMonth(now.getMonth() - i);
      const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
      revenueByMonth[monthKey] = 0;
    }

    // Fill in actual revenue data
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
}
