import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleType, DeliveryPersonStatus } from '../prisma/prisma.service';

@Injectable()
export class DeliveryPersonsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone: string;
    vehicleType: VehicleType;
    vehiclePlate?: string;
  }) {
    // Verificar se já existe um usuário com este email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Verificar se já existe um entregador com este CPF
    const existingDeliveryPerson = await this.prisma.deliveryPerson.findMany({
      where: { cpf: data.cpf },
    });

    if (existingDeliveryPerson.length > 0) {
      throw new Error('CPF already registered');
    }

    // Criar o usuário e o entregador em uma transação
    try {
      // Criar usuário
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password, // Assumindo que o hash é feito em outro lugar
          name: data.name,
          role: 'DELIVERY_PERSON',
        },
      });

      // Criar entregador
      const deliveryPerson = await this.prisma.deliveryPerson.create({
        data: {
          userId: user.id,
          cpf: data.cpf,
          phone: data.phone,
          vehicleType: data.vehicleType,
          vehiclePlate: data.vehiclePlate,
          status: DeliveryPersonStatus.AVAILABLE,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return deliveryPerson;
    } catch (error) {
      throw new Error(`Failed to create delivery person: ${error.message}`);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    status?: DeliveryPersonStatus;
    isActive?: boolean;
    search?: string;
  }) {
    const { skip, take, status, isActive, search } = params;
    
    const where = {
      status: status ? status : undefined,
      isActive: typeof isActive === 'boolean' ? isActive : undefined,
      user: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    };

    const deliveryPersons = await this.prisma.deliveryPerson.findMany({
      skip,
      take,
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    const total = await this.prisma.deliveryPerson.count({ where });

    return {
      data: deliveryPersons,
      total,
    };
  }

  async findOne(id: string) {
    return this.prisma.deliveryPerson.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        deliveries: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
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
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    phone?: string;
    vehicleType?: VehicleType;
    vehiclePlate?: string;
    status?: DeliveryPersonStatus;
    isActive?: boolean;
  }) {
    const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!deliveryPerson) {
      throw new Error('Delivery person not found');
    }

    // Atualizar dados do usuário se necessário
    if (data.name) {
      await this.prisma.user.update({
        where: { id: deliveryPerson.userId },
        data: {
          name: data.name,
        },
      });
    }

    // Atualizar dados do entregador
    return this.prisma.deliveryPerson.update({
      where: { id },
      data: {
        phone: data.phone,
        vehicleType: data.vehicleType,
        vehiclePlate: data.vehiclePlate,
        status: data.status,
        isActive: data.isActive,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateLocation(id: string, latitude: number, longitude: number) {
    return this.prisma.deliveryPerson.update({
      where: { id },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
      },
    });
  }

  async updateStatus(id: string, status: DeliveryPersonStatus) {
    return this.prisma.deliveryPerson.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.deliveryPerson.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async getDeliveryStats(id: string) {
    const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
      where: { id },
    });

    if (!deliveryPerson) {
      throw new Error('Delivery person not found');
    }

    // Obter estatísticas de entregas
    const completedDeliveries = await this.prisma.delivery.count({
      where: {
        deliveryPersonId: id,
        status: 'DELIVERED',
      },
    });

    const canceledDeliveries = await this.prisma.delivery.count({
      where: {
        deliveryPersonId: id,
        status: 'CANCELLED',
      },
    });

    const totalEarnings = await this.prisma.delivery.aggregate({
      where: {
        deliveryPersonId: id,
        status: 'DELIVERED',
      },
      _sum: {
        fee: true,
      },
    });

    return {
      totalDeliveries: deliveryPerson.totalDeliveries,
      completedDeliveries,
      canceledDeliveries,
      rating: deliveryPerson.rating,
      totalEarnings: totalEarnings._sum.fee || 0,
    };
  }

  async getAvailableDeliveryPersons(latitude: number, longitude: number) {
    // Encontrar entregadores disponíveis
    const availableDeliveryPersons = await this.prisma.deliveryPerson.findMany({
      where: {
        status: DeliveryPersonStatus.AVAILABLE,
        isActive: true,
        currentLatitude: { not: null },
        currentLongitude: { not: null },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calcular distância e ordenar por proximidade
    const deliveryPersonsWithDistance = availableDeliveryPersons
      .map(dp => {
        // Calcular distância usando a fórmula de Haversine
        const distance = this.calculateDistance(
          latitude,
          longitude,
          dp.currentLatitude,
          dp.currentLongitude,
        );
        
        return {
          ...dp,
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    return deliveryPersonsWithDistance;
  }

  // Função auxiliar para calcular distância usando a fórmula de Haversine
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
