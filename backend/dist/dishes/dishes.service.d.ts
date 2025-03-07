import { PrismaService } from '../prisma/prisma.service';
export declare class DishesService {
    private prisma;
    constructor(prisma: PrismaService);
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
