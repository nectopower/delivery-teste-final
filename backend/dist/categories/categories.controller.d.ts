import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: {
        name: string;
        restaurantId: string;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
    }>;
    findByRestaurant(restaurantId: string): Promise<any[]>;
    update(id: string, updateCategoryDto: {
        name: string;
    }): Promise<any>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
