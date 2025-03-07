import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        orderStats: {
            PENDING: number;
            ACCEPTED: number;
            PREPARING: number;
            READY_FOR_PICKUP: number;
            OUT_FOR_DELIVERY: number;
            DELIVERED: number;
            CANCELLED: number;
        };
        userStats: {
            ADMIN: number;
            RESTAURANT: number;
            CUSTOMER: number;
        };
        restaurantStats: {
            total: number;
            approved: number;
            pending: number;
        };
        paymentStats: {
            totalRevenue: any;
        };
    }>;
    approveRestaurant(id: string): Promise<any>;
    rejectRestaurant(id: string): Promise<any>;
}
