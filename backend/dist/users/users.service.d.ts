import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: string;
        name: string;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: string;
        name: string;
    }>;
    create(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<any>;
    update(id: string, data: {
        email?: string;
        name?: string;
        password?: string;
    }): Promise<any>;
}
