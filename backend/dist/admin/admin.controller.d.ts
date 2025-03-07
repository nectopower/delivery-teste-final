import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
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
}
