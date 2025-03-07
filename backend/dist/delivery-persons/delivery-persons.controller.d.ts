import { DeliveryPersonsService } from './delivery-persons.service';
import { VehicleType, DeliveryPersonStatus } from '../prisma/prisma.service';
export declare class DeliveryPersonsController {
    private readonly deliveryPersonsService;
    constructor(deliveryPersonsService: DeliveryPersonsService);
    create(data: {
        email: string;
        password: string;
        name: string;
        cpf: string;
        phone: string;
        vehicleType: VehicleType;
        vehiclePlate?: string;
    }): Promise<any>;
    findAll(skip?: string, take?: string, status?: DeliveryPersonStatus, isActive?: string, search?: string): Promise<{
        data: any[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        cpf: string;
        phone: string;
        vehicleType: string;
        vehiclePlate: string;
        status: string;
        rating: number;
        totalDeliveries: number;
        isActive: boolean;
        currentLatitude: number;
        currentLongitude: number;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        };
        deliveries: any[];
    }>;
    update(id: string, data: {
        name?: string;
        phone?: string;
        vehicleType?: VehicleType;
        vehiclePlate?: string;
        status?: DeliveryPersonStatus;
        isActive?: boolean;
    }): Promise<any>;
    updateLocation(id: string, data: {
        latitude: number;
        longitude: number;
    }): Promise<any>;
    updateStatus(id: string, data: {
        status: DeliveryPersonStatus;
    }): Promise<any>;
    remove(id: string): Promise<any>;
    getDeliveryStats(id: string): Promise<{
        totalDeliveries: number;
        completedDeliveries: number;
        canceledDeliveries: number;
        rating: number;
        totalEarnings: number;
    }>;
    getAvailableDeliveryPersons(latitude: string, longitude: string): Promise<any[]>;
}
