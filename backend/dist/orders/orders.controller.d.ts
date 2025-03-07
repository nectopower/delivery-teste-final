import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
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
    updateStatus(id: string, data: {
        status: string;
    }): Promise<any>;
    findByRestaurant(restaurantId: string): Promise<any[]>;
    findByCustomer(customerId: string): Promise<any[]>;
    findAll(): Promise<any[]>;
}
