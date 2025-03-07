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
exports.DeliveriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const delivery_fee_service_1 = require("../delivery-fee/delivery-fee.service");
const prisma_service_2 = require("../prisma/prisma.service");
let DeliveriesService = class DeliveriesService {
    constructor(prisma, deliveryFeeService) {
        this.prisma = prisma;
        this.deliveryFeeService = deliveryFeeService;
    }
    async create(data) {
        const order = await this.prisma.order.findUnique({
            where: { id: data.orderId },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        const fee = await this.deliveryFeeService.calculateDeliveryFee(data.distance);
        const estimatedTime = await this.deliveryFeeService.getDeliveryTimeEstimate(data.distance);
        return this.prisma.delivery.create({
            data: {
                orderId: data.orderId,
                fee,
                distance: data.distance,
                estimatedTime,
                status: prisma_service_2.OrderStatus.PENDING,
            },
        });
    }
    async findAll(params) {
        const { skip, take, status, deliveryPersonId } = params;
        const where = {
            status: status ? status : undefined,
            deliveryPersonId: deliveryPersonId ? deliveryPersonId : undefined,
        };
        const deliveries = await this.prisma.delivery.findMany({
            skip,
            take,
            where,
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
                                address: true,
                            },
                        },
                    },
                },
                deliveryPerson: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                            },
                        },
                        vehicleType: true,
                        vehiclePlate: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const total = await this.prisma.delivery.count({ where });
        return {
            data: deliveries,
            total,
        };
    }
    async findOne(id) {
        return this.prisma.delivery.findUnique({
            where: { id },
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
                                        email: true,
                                    },
                                },
                                phone: true,
                            },
                        },
                        restaurant: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                                address: true,
                                phone: true,
                            },
                        },
                        items: {
                            include: {
                                dish: true,
                            },
                        },
                    },
                },
                deliveryPerson: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                        phone: true,
                        vehicleType: true,
                        vehiclePlate: true,
                        currentLatitude: true,
                        currentLongitude: true,
                    },
                },
            },
        });
    }
    async assignDeliveryPerson(id, deliveryPersonId) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id },
        });
        if (!delivery) {
            throw new Error('Delivery not found');
        }
        if (delivery.deliveryPerson) {
            throw new Error('Delivery already assigned to a delivery person');
        }
        await this.prisma.$transaction([
            this.prisma.delivery.update({
                where: { id },
                data: {
                    deliveryPersonId,
                    status: prisma_service_2.OrderStatus.PREPARING,
                },
            }),
            this.prisma.deliveryPerson.update({
                where: { id: deliveryPersonId },
                data: {
                    status: 'BUSY',
                },
            }),
        ]);
        return this.findOne(id);
    }
    async updateStatus(id, status) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id },
            include: {
                deliveryPerson: true,
            },
        });
        if (!delivery) {
            throw new Error('Delivery not found');
        }
        if (status === prisma_service_2.OrderStatus.DELIVERED || status === prisma_service_2.OrderStatus.CANCELLED) {
            if (delivery.deliveryPerson) {
                await this.prisma.deliveryPerson.update({
                    where: { id: delivery.deliveryPerson.id },
                    data: {
                        status: 'AVAILABLE',
                        totalDeliveries: status === prisma_service_2.OrderStatus.DELIVERED
                            ? { increment: 1 }
                            : undefined,
                    },
                });
            }
            if (status === prisma_service_2.OrderStatus.DELIVERED) {
                return this.prisma.delivery.update({
                    where: { id },
                    data: {
                        status,
                        endTime: new Date(),
                    },
                });
            }
        }
        const hasStartTime = delivery.createdAt;
        if (status === prisma_service_2.OrderStatus.DELIVERING && !hasStartTime) {
            return this.prisma.delivery.update({
                where: { id },
                data: {
                    status,
                    startTime: new Date(),
                },
            });
        }
        return this.prisma.delivery.update({
            where: { id },
            data: { status },
        });
    }
    async rateDelivery(id, data) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id },
            include: {
                deliveryPerson: true,
            },
        });
        if (!delivery) {
            throw new Error('Delivery not found');
        }
        if (!delivery.deliveryPerson) {
            throw new Error('This delivery has no assigned delivery person');
        }
        await this.prisma.delivery.update({
            where: { id },
            data: {
                customerRating: data.rating,
                customerFeedback: data.feedback,
            },
        });
        const deliveryPersonRatings = await this.prisma.delivery.findMany({
            where: {
                deliveryPersonId: delivery.deliveryPerson.id,
                customerRating: { not: null },
            },
            select: {
                customerRating: true,
            },
        });
        const totalRatings = deliveryPersonRatings.length;
        const sumRatings = deliveryPersonRatings.reduce((sum, item) => sum + item.customerRating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        await this.prisma.deliveryPerson.update({
            where: { id: delivery.deliveryPerson.id },
            data: {
                rating: averageRating,
            },
        });
        return this.findOne(id);
    }
    async getPendingDeliveries() {
        return this.prisma.delivery.findMany({
            where: {
                deliveryPersonId: null,
                status: prisma_service_2.OrderStatus.PENDING,
            },
            include: {
                order: {
                    select: {
                        id: true,
                        total: true,
                        address: true,
                        createdAt: true,
                        restaurant: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                                address: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
};
exports.DeliveriesService = DeliveriesService;
exports.DeliveriesService = DeliveriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        delivery_fee_service_1.DeliveryFeeService])
], DeliveriesService);
//# sourceMappingURL=deliveries.service.js.map