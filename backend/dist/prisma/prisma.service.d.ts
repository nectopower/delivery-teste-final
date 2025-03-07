import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare enum UserRole {
    ADMIN = "ADMIN",
    RESTAURANT = "RESTAURANT",
    CUSTOMER = "CUSTOMER",
    DELIVERY_PERSON = "DELIVERY_PERSON"
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    PREPARING = "PREPARING",
    READY = "READY",
    DELIVERING = "DELIVERING",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    PIX = "PIX",
    CASH = "CASH"
}
export declare enum DeliveryPersonStatus {
    AVAILABLE = "AVAILABLE",
    BUSY = "BUSY",
    OFFLINE = "OFFLINE"
}
export declare enum VehicleType {
    BICYCLE = "BICYCLE",
    MOTORCYCLE = "MOTORCYCLE",
    CAR = "CAR",
    VAN = "VAN"
}
declare class MockPrismaClient {
    user: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            email: string;
            password: string;
            role: string;
            name: string;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    restaurant: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            name: string;
            isApproved: boolean;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    dish: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            name: string;
            price: number;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    order: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            status: string;
            total: number;
            customer: {
                userId: string;
                user: {
                    email: string;
                    name: string;
                };
            };
            restaurant: {
                id: string;
                name: string;
            };
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    customer: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            userId: string;
            address: string;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    admin: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            userId: string;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    payment: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            orderId: string;
            amount: number;
            status: string;
            order: {
                customer: {
                    userId: string;
                    user: {
                        email: string;
                        name: string;
                    };
                };
            };
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
        aggregate: (params?: {}) => Promise<{
            _sum: {
                amount: number;
            };
        }>;
    };
    category: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            name: string;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    orderItem: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            quantity: number;
            price: number;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    notification: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            type: string;
            message: string;
            recipientId: string;
            read: boolean;
            data: {};
            createdAt: Date;
            updatedAt: Date;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    delivery: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            orderId: string;
            status: string;
            fee: number;
            distance: number;
            estimatedTime: number;
            deliveryPersonId: any;
            startTime: any;
            endTime: any;
            customerRating: any;
            customerFeedback: any;
            createdAt: Date;
            updatedAt: Date;
            order: {
                id: string;
                status: string;
                total: number;
                address: string;
                customer: {
                    user: {
                        name: string;
                        email: string;
                    };
                    phone: string;
                };
                restaurant: {
                    user: {
                        name: string;
                    };
                    address: string;
                    phone: string;
                };
                items: any[];
            };
            deliveryPerson: any;
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
        aggregate: (params?: {}) => Promise<{
            _sum: {
                fee: number;
            };
        }>;
    };
    deliveryPerson: {
        create: (data: any) => Promise<any>;
        findUnique: (params: any) => Promise<{
            id: string;
            userId: string;
            cpf: string;
            phone: string;
            vehicleType: string;
            vehiclePlate: string;
            status: string;
            rating: number;
            totalDeliveries: number;
            isActive: boolean;
            currentLatitude: number;
            currentLongitude: number;
            createdAt: Date;
            updatedAt: Date;
            user: {
                id: string;
                name: string;
                email: string;
            };
            deliveries: any[];
        }>;
        findMany: (params?: {}) => Promise<any[]>;
        update: (params: any) => Promise<any>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    deliveryFeeConfig: {
        create: (data: any) => Promise<any>;
        findFirst: () => Promise<{
            id: string;
            basePrice: number;
            pricePerKm: number;
            rushHourMultiplier: number;
            rushHourStart: number;
            rushHourEnd: number;
            nightFeeMultiplier: number;
            nightFeeStart: number;
            nightFeeEnd: number;
            createdAt: Date;
            updatedAt: Date;
        }>;
        update: (params: any) => Promise<any>;
        findMany: (params?: {}) => Promise<any[]>;
        delete: (params: any) => Promise<{
            id: string;
        }>;
        count: (params?: {}) => Promise<number>;
    };
    $transaction: (operations: any) => Promise<any[]>;
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}
export declare class PrismaService extends MockPrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export {};
