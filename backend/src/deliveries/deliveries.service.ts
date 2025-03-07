import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryFeeService } from '../delivery-fee/delivery-fee.service';
import { OrderStatus } from '../prisma/prisma.service';

@Injectable()
export class DeliveriesService {
  constructor(
    private prisma: PrismaService,
    private deliveryFeeService: DeliveryFeeService,
  ) {}

  async create(data: {
    orderId: string;
    distance: number;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const fee = await this.deliveryFeeService.calculateDeliveryFee(data.distance);
    const estimatedTime = await this.deliveryFeeService.getDeliveryTimeEstimate(data.distance);

    return this.prisma.delivery.create({
      data: {
        orderId: data.orderId,
        fee,
        distance: data.distance,
        estimatedTime,
        status: OrderStatus.PENDING,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    status?: OrderStatus;
    deliveryPersonId?: string;
  }) {
    const { skip, take, status, deliveryPersonId } = params;
    
    const where = {
      status: status ? status : undefined,
      deliveryPersonId: deliveryPersonId ? deliveryPersonId : undefined,
    };

    const deliveries = await this.prisma.delivery.findMany({
      skip,
      take,
      where,
      include: {
        order: {
          select: {
            id: true,
            status: true,
            total: true,
            address: true,
            createdAt: true,
            customer: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            restaurant: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
                address: true,
              },
            },
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
            vehicleType: true,
            vehiclePlate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.delivery.count({ where });

    return {
      data: deliveries,
      total,
    };
  }

  async findOne(id: string) {
    return this.prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            total: true,
            address: true,
            createdAt: true,
            customer: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                phone: true,
              },
            },
            restaurant: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
                address: true,
                phone: true,
              },
            },
            items: {
              include: {
                dish: true,
              },
            },
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            phone: true,
            vehicleType: true,
            vehiclePlate: true,
            currentLatitude: true,
            currentLongitude: true,
          },
        },
      },
    });
  }

  async assignDeliveryPerson(id: string, deliveryPersonId: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    // Verificar se já tem um entregador atribuído
    if (delivery.deliveryPerson) {
      throw new Error('Delivery already assigned to a delivery person');
    }

    // Atualizar a entrega e o status do entregador
    await this.prisma.$transaction([
      this.prisma.delivery.update({
        where: { id },
        data: {
          deliveryPersonId,
          status: OrderStatus.PREPARING,
        },
      }),
      this.prisma.deliveryPerson.update({
        where: { id: deliveryPersonId },
        data: {
          status: 'BUSY',
        },
      }),
    ]);

    return this.findOne(id);
  }

  async updateStatus(id: string, status: OrderStatus) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: {
        deliveryPerson: true,
      },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    // Se a entrega foi concluída ou cancelada, atualizar o status do entregador
    if (status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED) {
      if (delivery.deliveryPerson) {
        await this.prisma.deliveryPerson.update({
          where: { id: delivery.deliveryPerson.id },
          data: {
            status: 'AVAILABLE',
            totalDeliveries: status === OrderStatus.DELIVERED 
              ? { increment: 1 } 
              : undefined,
          },
        });
      }

      // Se foi concluída, registrar o horário de término
      if (status === OrderStatus.DELIVERED) {
        return this.prisma.delivery.update({
          where: { id },
          data: {
            status,
            endTime: new Date(),
          },
        });
      }
    }

    // Se está começando a entrega, registrar o horário de início
    const hasStartTime = delivery.createdAt; // Usamos createdAt como substituto para startTime
    if (status === OrderStatus.DELIVERING && !hasStartTime) {
      return this.prisma.delivery.update({
        where: { id },
        data: {
          status,
          startTime: new Date(),
        },
      });
    }

    // Atualização padrão de status
    return this.prisma.delivery.update({
      where: { id },
      data: { status },
    });
  }

  async rateDelivery(id: string, data: { rating: number; feedback?: string }) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: {
        deliveryPerson: true,
      },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (!delivery.deliveryPerson) {
      throw new Error('This delivery has no assigned delivery person');
    }

    // Atualizar a avaliação da entrega
    await this.prisma.delivery.update({
      where: { id },
      data: {
        customerRating: data.rating,
        customerFeedback: data.feedback,
      },
    });

    // Recalcular a média de avaliações do entregador
    const deliveryPersonRatings = await this.prisma.delivery.findMany({
      where: {
        deliveryPersonId: delivery.deliveryPerson.id,
        customerRating: { not: null },
      },
      select: {
        customerRating: true,
      },
    });

    const totalRatings = deliveryPersonRatings.length;
    const sumRatings = deliveryPersonRatings.reduce(
      (sum, item) => sum + item.customerRating,
      0,
    );
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Atualizar a avaliação média do entregador
    await this.prisma.deliveryPerson.update({
      where: { id: delivery.deliveryPerson.id },
      data: {
        rating: averageRating,
      },
    });

    return this.findOne(id);
  }

  async getPendingDeliveries() {
    return this.prisma.delivery.findMany({
      where: {
        deliveryPersonId: null,
        status: OrderStatus.PENDING,
      },
      include: {
        order: {
          select: {
            id: true,
            total: true,
            address: true,
            createdAt: true,
            restaurant: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
                address: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
