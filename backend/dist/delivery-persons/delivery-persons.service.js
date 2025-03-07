"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryPersonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_service_2 = require("../prisma/prisma.service");
let DeliveryPersonsService = class DeliveryPersonsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const existingDeliveryPerson = await this.prisma.deliveryPerson.findMany({
            where: { cpf: data.cpf },
        });
        if (existingDeliveryPerson.length > 0) {
            throw new Error('CPF already registered');
        }
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    role: 'DELIVERY_PERSON',
                },
            });
            const deliveryPerson = await this.prisma.deliveryPerson.create({
                data: {
                    userId: user.id,
                    cpf: data.cpf,
                    phone: data.phone,
                    vehicleType: data.vehicleType,
                    vehiclePlate: data.vehiclePlate,
                    status: prisma_service_2.DeliveryPersonStatus.AVAILABLE,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            return deliveryPerson;
        }
        catch (error) {
            throw new Error(`Failed to create delivery person: ${error.message}`);
        }
    }
    async findAll(params) {
        const { skip, take, status, isActive, search } = params;
        const where = {
            status: status ? status : undefined,
            isActive: typeof isActive === 'boolean' ? isActive : undefined,
            user: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
        };
        const deliveryPersons = await this.prisma.deliveryPerson.findMany({
            skip,
            take,
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                user: {
                    name: 'asc',
                },
            },
        });
        const total = await this.prisma.deliveryPerson.count({ where });
        return {
            data: deliveryPersons,
            total,
        };
    }
    async findOne(id) {
        return this.prisma.deliveryPerson.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                deliveries: {
                    take: 10,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        order: {
                            select: {
                                id: true,
                                status: true,
                                total: true,
                                address: true,
                                createdAt: true,
                                customer: {
                                    select: {
                                        user: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                                restaurant: {
                                    select: {
                                        user: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async update(id, data) {
        const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
        if (!deliveryPerson) {
            throw new Error('Delivery person not found');
        }
        if (data.name) {
            await this.prisma.user.update({
                where: { id: deliveryPerson.userId },
                data: {
                    name: data.name,
                },
            });
        }
        return this.prisma.deliveryPerson.update({
            where: { id },
            data: {
                phone: data.phone,
                vehicleType: data.vehicleType,
                vehiclePlate: data.vehiclePlate,
                status: data.status,
                isActive: data.isActive,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async updateLocation(id, latitude, longitude) {
        return this.prisma.deliveryPerson.update({
            where: { id },
            data: {
                currentLatitude: latitude,
                currentLongitude: longitude,
            },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.deliveryPerson.update({
            where: { id },
            data: {
                status,
            },
        });
    }
    async remove(id) {
        return this.prisma.deliveryPerson.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
    }
    async getDeliveryStats(id) {
        const deliveryPerson = await this.prisma.deliveryPerson.findUnique({
            where: { id },
        });
        if (!deliveryPerson) {
            throw new Error('Delivery person not found');
        }
        const completedDeliveries = await this.prisma.delivery.count({
            where: {
                deliveryPersonId: id,
                status: 'DELIVERED',
            },
        });
        const canceledDeliveries = await this.prisma.delivery.count({
            where: {
                deliveryPersonId: id,
                status: 'CANCELLED',
            },
        });
        const totalEarnings = await this.prisma.delivery.aggregate({
            where: {
                deliveryPersonId: id,
                status: 'DELIVERED',
            },
            _sum: {
                fee: true,
            },
        });
        return {
            totalDeliveries: deliveryPerson.totalDeliveries,
            completedDeliveries,
            canceledDeliveries,
            rating: deliveryPerson.rating,
            totalEarnings: totalEarnings._sum.fee || 0,
        };
    }
    async getAvailableDeliveryPersons(latitude, longitude) {
        const availableDeliveryPersons = await this.prisma.deliveryPerson.findMany({
            where: {
                status: prisma_service_2.DeliveryPersonStatus.AVAILABLE,
                isActive: true,
                currentLatitude: { not: null },
                currentLongitude: { not: null },
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        const deliveryPersonsWithDistance = availableDeliveryPersons
            .map(dp => {
            const distance = this.calculateDistance(latitude, longitude, dp.currentLatitude, dp.currentLongitude);
            return {
                ...dp,
                distance,
            };
        })
            .sort((a, b) => a.distance - b.distance);
        return deliveryPersonsWithDistance;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.DeliveryPersonsService = DeliveryPersonsService;
exports.DeliveryPersonsService = DeliveryPersonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliveryPersonsService);
//# sourceMappingURL=delivery-persons.service.js.map