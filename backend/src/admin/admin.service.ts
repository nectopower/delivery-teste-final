import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // Get order statistics
    const orders = await this.prisma.order.findMany();
    
    // Count orders by status
    const orderStats = {
      PENDING: orders.filter(order => order.status === 'PENDING').length,
      ACCEPTED: orders.filter(order => order.status === 'ACCEPTED').length,
      PREPARING: orders.filter(order => order.status === 'PREPARING').length,
      READY_FOR_PICKUP: orders.filter(order => order.status === 'READY_FOR_PICKUP').length,
      OUT_FOR_DELIVERY: orders.filter(order => order.status === 'OUT_FOR_DELIVERY').length,
      DELIVERED: orders.filter(order => order.status === 'DELIVERED').length,
      CANCELLED: orders.filter(order => order.status === 'CANCELLED').length,
    };

    // Get user statistics
    const users = await this.prisma.user.findMany();
    
    const userStats = {
      ADMIN: users.filter(user => user.role === 'ADMIN').length,
      RESTAURANT: users.filter(user => user.role === 'RESTAURANT').length,
      CUSTOMER: users.filter(user => user.role === 'CUSTOMER').length,
    };

    // Get restaurant statistics
    const restaurants = await this.prisma.restaurant.findMany();
    const approvedRestaurants = restaurants.filter(r => r.isApproved).length;
    const pendingRestaurants = restaurants.filter(r => !r.isApproved).length;

    // Get payment statistics
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

  async approveRestaurant(id: string) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async rejectRestaurant(id: string) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isApproved: false },
    });
  }
}
