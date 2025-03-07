import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
export declare class OrdersService {
    private prisma;
    private ordersGateway;
    constructor(prisma: PrismaService, ordersGateway: OrdersGateway);
    create(data: any): Promise<any>;
    findById(id: string): Promise<{
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
    updateStatus(id: string, status: string): Promise<any>;
    findByRestaurant(restaurantId: string): Promise<any[]>;
    findByCustomer(customerId: string): Promise<any[]>;
    findAll(): Promise<any[]>;
}
