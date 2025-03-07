import { PrismaService } from '../prisma/prisma.service';
export declare class DeliveryFeeService {
    private prisma;
    constructor(prisma: PrismaService);
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
    calculateDeliveryFee(distance: number): Promise<number>;
    getDeliveryTimeEstimate(distance: number): Promise<number>;
}
