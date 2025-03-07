import { DeliveryFeeService } from './delivery-fee.service';
export declare class DeliveryFeeController {
    private deliveryFeeService;
    constructor(deliveryFeeService: DeliveryFeeService);
    getConfig(): Promise<any>;
    updateConfig(data: {
        basePrice?: number;
        pricePerKm?: number;
        rushHourMultiplier?: number;
        rushHourStart?: number;
        rushHourEnd?: number;
        nightFeeMultiplier?: number;
        nightFeeStart?: number;
        nightFeeEnd?: number;
    }): Promise<any>;
    calculateFee(data: {
        distance: number;
        orderTime?: string;
    }): Promise<{
        fee: number;
        estimatedTime: number;
    }>;
}
