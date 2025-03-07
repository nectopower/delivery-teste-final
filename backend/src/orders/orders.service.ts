import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private ordersGateway: OrdersGateway
  ) {}

  async create(data: any) {
    const { items, ...orderData } = data;
    
    // Calculate total from items
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        total,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        customer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Notify via WebSocket
    this.ordersGateway.notifyOrderStatusChange(order);
    
    return order;
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        customer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        payment: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        customer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Notify via WebSocket
    this.ordersGateway.notifyOrderStatusChange(order);
    
    return order;
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        customer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCustomer(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        customer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
