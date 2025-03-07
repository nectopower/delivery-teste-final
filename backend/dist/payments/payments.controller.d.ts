import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    create(data: any): Promise<any>;
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
    findByOrderId(orderId: string): Promise<any>;
    findAll(): Promise<any[]>;
    updateStatus(id: string, data: {
        status: string;
    }): Promise<any>;
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
