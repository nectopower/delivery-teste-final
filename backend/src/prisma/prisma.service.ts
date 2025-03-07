import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

// Definindo os enums que seriam gerados pelo Prisma
export enum UserRole {
  ADMIN = 'ADMIN',
  RESTAURANT = 'RESTAURANT',
  CUSTOMER = 'CUSTOMER',
  DELIVERY_PERSON = 'DELIVERY_PERSON'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  CASH = 'CASH'
}

export enum DeliveryPersonStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE'
}

export enum VehicleType {
  BICYCLE = 'BICYCLE',
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  VAN = 'VAN'
}

// Mock PrismaClient to avoid dependency on the actual Prisma engine
class MockPrismaClient {
  user = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => {
      if (params?.where?.email === 'admin@example.com') {
        return { id: 'admin-id', email: 'admin@example.com', password: 'hashed_password', role: 'ADMIN', name: 'Admin User' };
      }
      return null;
    },
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  restaurant = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'restaurant-id', name: 'Mock Restaurant', isApproved: true }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  dish = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'dish-id', name: 'Mock Dish', price: 10.99 }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  order = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ 
      id: 'order-id', 
      status: 'PENDING', 
      total: 20.99,
      customer: {
        userId: 'user-id',
        user: {
          email: 'customer@example.com',
          name: 'Customer Name'
        }
      },
      restaurant: {
        id: 'restaurant-id',
        name: 'Restaurant Name'
      }
    }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  // Add missing models
  customer = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'customer-id', userId: 'user-id', address: '123 Main St' }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  admin = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'admin-id', userId: 'user-id' }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  payment = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ 
      id: 'payment-id', 
      orderId: 'order-id', 
      amount: 20.99, 
      status: 'COMPLETED',
      order: {
        customer: {
          userId: 'user-id',
          user: {
            email: 'customer@example.com',
            name: 'Customer Name'
          }
        }
      }
    }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0,
    aggregate: async (params = {}) => ({ _sum: { amount: 1000 } })
  };
  
  category = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'category-id', name: 'Mock Category' }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  orderItem = {
    create: async (data) => ({ id: 'mock-id', ...data.data }),
    findUnique: async (params) => ({ id: 'order-item-id', quantity: 2, price: 10.99 }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'mock-id', ...params.data }),
    delete: async (params) => ({ id: 'mock-id' }),
    count: async (params = {}) => 0
  };
  
  // Add notification model
  notification = {
    create: async (data) => ({ 
      id: 'notification-id', 
      ...data.data,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findUnique: async (params) => ({ 
      id: 'notification-id', 
      type: 'ORDER_STATUS', 
      message: 'Your order status has changed',
      recipientId: 'user-id',
      read: false,
      data: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'notification-id', ...params.data }),
    delete: async (params) => ({ id: 'notification-id' }),
    count: async (params = {}) => 0
  };
  
  // Add delivery model
  delivery = {
    create: async (data) => ({ 
      id: 'delivery-id', 
      ...data.data,
      deliveryPersonId: data.data.deliveryPersonId || null,
      startTime: null,
      endTime: null,
      customerRating: null,
      customerFeedback: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findUnique: async (params) => ({ 
      id: 'delivery-id', 
      orderId: 'order-id',
      status: 'PENDING',
      fee: 5.99,
      distance: 3.5,
      estimatedTime: 30,
      deliveryPersonId: null,
      startTime: null,
      endTime: null,
      customerRating: null,
      customerFeedback: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: {
        id: 'order-id',
        status: 'PENDING',
        total: 25.99,
        address: '123 Main St',
        customer: {
          user: {
            name: 'Customer Name',
            email: 'customer@example.com'
          },
          phone: '123456789'
        },
        restaurant: {
          user: {
            name: 'Restaurant Name'
          },
          address: '456 Food St',
          phone: '987654321'
        },
        items: []
      },
      deliveryPerson: null
    }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ 
      id: 'delivery-id', 
      ...params.data,
      deliveryPersonId: params.data.deliveryPersonId || null,
      startTime: params.data.startTime || null,
      endTime: params.data.endTime || null,
      customerRating: params.data.customerRating || null,
      customerFeedback: params.data.customerFeedback || null
    }),
    delete: async (params) => ({ id: 'delivery-id' }),
    count: async (params = {}) => 0,
    aggregate: async (params = {}) => ({ _sum: { fee: 100 } })
  };
  
  // Add deliveryPerson model
  deliveryPerson = {
    create: async (data) => ({ 
      id: 'delivery-person-id', 
      ...data.data,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findUnique: async (params) => ({ 
      id: 'delivery-person-id', 
      userId: 'user-id',
      cpf: '12345678900',
      phone: '123456789',
      vehicleType: 'MOTORCYCLE',
      vehiclePlate: 'ABC1234',
      status: 'AVAILABLE',
      rating: 4.5,
      totalDeliveries: 50,
      isActive: true,
      currentLatitude: -23.5505,
      currentLongitude: -46.6333,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: 'user-id',
        name: 'Delivery Person Name',
        email: 'delivery@example.com'
      },
      deliveries: []
    }),
    findMany: async (params = {}) => [],
    update: async (params) => ({ id: 'delivery-person-id', ...params.data }),
    delete: async (params) => ({ id: 'delivery-person-id' }),
    count: async (params = {}) => 0
  };
  
  // Add deliveryFeeConfig model
  deliveryFeeConfig = {
    create: async (data) => ({ 
      id: 'delivery-fee-config-id', 
      ...data.data,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    findFirst: async () => ({ 
      id: 'delivery-fee-config-id', 
      basePrice: 5.0,
      pricePerKm: 1.5,
      rushHourMultiplier: 1.5,
      rushHourStart: 17,
      rushHourEnd: 21,
      nightFeeMultiplier: 1.2,
      nightFeeStart: 22,
      nightFeeEnd: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    update: async (params) => ({ id: 'delivery-fee-config-id', ...params.data }),
    findMany: async (params = {}) => [],
    delete: async (params) => ({ id: 'delivery-fee-config-id' }),
    count: async (params = {}) => 0
  };
  
  // Mock transaction method
  $transaction = async (operations) => {
    const results = [];
    for (const operation of operations) {
      const result = await operation;
      results.push(result);
    }
    return results;
  };
  
  // Mock connection methods
  $connect() {
    console.log('Mock Prisma client connected');
    return Promise.resolve();
  }
  
  $disconnect() {
    console.log('Mock Prisma client disconnected');
    return Promise.resolve();
  }
}

@Injectable()
export class PrismaService extends MockPrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
    console.log('Using Mock Prisma Client due to environment constraints');
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
