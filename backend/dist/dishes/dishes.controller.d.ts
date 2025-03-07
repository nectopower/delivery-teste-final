import { DishesService } from './dishes.service';
export declare class DishesController {
    private dishesService;
    constructor(dishesService: DishesService);
    create(data: any): Promise<any>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        price: number;
    }>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<{
        id: string;
    }>;
    findByRestaurant(restaurantId: string): Promise<any[]>;
}
