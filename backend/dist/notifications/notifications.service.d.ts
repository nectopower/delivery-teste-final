import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrderNotification(orderId: string, status: string): Promise<any>;
    createPaymentNotification(paymentId: string, status: string): Promise<any>;
    markAsRead(id: string): Promise<any>;
    getUnreadByUser(userId: string): Promise<any[]>;
    getAllByUser(userId: string): Promise<any[]>;
}
