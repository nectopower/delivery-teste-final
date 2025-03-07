import { PrismaService } from '../prisma/prisma.service';
export declare class RestaurantService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        isApproved: boolean;
    }>;
    findByUserId(userId: string): Promise<{
        id: string;
        name: string;
        isApproved: boolean;
    }>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<{
        id: string;
    }>;
    updateApprovalStatus(id: string, isApproved: boolean): Promise<any>;
}
