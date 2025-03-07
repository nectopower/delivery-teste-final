import { CustomerService } from './customer.service';
export declare class CustomerController {
    private customerService;
    constructor(customerService: CustomerService);
    getProfile(req: any): Promise<{
        id: string;
        userId: string;
        address: string;
    }>;
    updateProfile(req: any, data: any): Promise<any>;
    getOrderHistory(req: any): Promise<any[]>;
}
