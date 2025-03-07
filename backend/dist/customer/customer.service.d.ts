import { PrismaService } from '../prisma/prisma.service';
export declare class CustomerService {
    private prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<{
        id: string;
        userId: string;
        address: string;
    }>;
    update(id: string, data: any): Promise<any>;
    getOrderHistory(customerId: string): Promise<any[]>;
}
