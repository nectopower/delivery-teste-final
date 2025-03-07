import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        isApproved: boolean;
    }>;
    create(createRestaurantDto: any): Promise<any>;
    update(id: string, updateRestaurantDto: any): Promise<any>;
    remove(id: string): Promise<{
        id: string;
    }>;
    approveRestaurant(id: string, data: {
        isApproved: boolean;
    }): Promise<any>;
    getRestaurantDishes(id: string): any[];
    getRestaurantReviews(id: string): any[];
    rateRestaurant(id: string, ratingData: {
        rating: number;
        comment?: string;
        commentType?: 'praise' | 'criticism';
    }): {
        success: boolean;
        message: string;
    };
}
