import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        restaurantId: string;
    }): Promise<any>;
    findAll(restaurantId?: string): Promise<any[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
    }>;
    findByRestaurant(restaurantId: string): Promise<any[]>;
    update(id: string, data: {
        name: string;
    }): Promise<any>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
