import { DeliveriesService } from './deliveries.service';
import { OrderStatus } from '../prisma/prisma.service';
export declare class DeliveriesController {
    private readonly deliveriesService;
    constructor(deliveriesService: DeliveriesService);
    create(data: {
        orderId: string;
        distance: number;
    }): Promise<any>;
    findAll(skip?: string, take?: string, status?: OrderStatus, deliveryPersonId?: string): Promise<{
        data: any[];
        total: number;
    }>;
    findOne(id: string): Promise<{
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
    assignDeliveryPerson(id: string, data: {
        deliveryPersonId: string;
    }): Promise<{
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
    updateStatus(id: string, data: {
        status: OrderStatus;
    }): Promise<any>;
    rateDelivery(id: string, data: {
        rating: number;
        feedback?: string;
    }): Promise<{
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
    getPendingDeliveries(): Promise<any[]>;
}
