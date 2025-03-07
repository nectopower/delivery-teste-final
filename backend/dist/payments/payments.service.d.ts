import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        amount: number;
        orderId: string;
        provider?: string;
        externalId?: string;
    }): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<{
        id: string;
        orderId: string;
        amount: number;
        status: string;
        order: {
            customer: {
                userId: string;
                user: {
                    email: string;
                    name: string;
                };
            };
        };
    }>;
    findById(id: string): Promise<{
        id: string;
        orderId: string;
        amount: number;
        status: string;
        order: {
            customer: {
                userId: string;
                user: {
                    email: string;
                    name: string;
                };
            };
        };
    }>;
    findByOrder(orderId: string): Promise<any>;
    update(id: string, data: {
        status?: string;
        externalId?: string;
    }): Promise<any>;
    updateStatus(id: string, status: string): Promise<any>;
    processPayment(id: string): Promise<any>;
    getPaymentStats(): Promise<{
        totalRevenue: any;
        completedPayments: number;
        pendingPayments: number;
        failedPayments: number;
        revenueByMonth: {
            month: string;
            amount: unknown;
        }[];
    }>;
}
