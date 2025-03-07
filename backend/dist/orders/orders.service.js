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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const orders_gateway_1 = require("./orders.gateway");
let OrdersService = class OrdersService {
    constructor(prisma, ordersGateway) {
        this.prisma = prisma;
        this.ordersGateway = ordersGateway;
    }
    async create(data) {
        const { items, ...orderData } = data;
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = await this.prisma.order.create({
            data: {
                ...orderData,
                total,
                items: {
                    create: items,
                },
            },
            include: {
                items: {
                    include: {
                        dish: true,
                    },
                },
                restaurant: true,
                customer: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        this.ordersGateway.notifyOrderStatusChange(order);
        return order;
    }
    async findById(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        dish: true,
                    },
                },
                restaurant: true,
                customer: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
    }
    async updateStatus(id, status) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        dish: true,
                    },
                },
                restaurant: true,
                customer: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        this.ordersGateway.notifyOrderStatusChange(order);
        return order;
    }
    async findByRestaurant(restaurantId) {
        return this.prisma.order.findMany({
            where: { restaurantId },
            include: {
                items: {
                    include: {
                        dish: true,
                    },
                },
                customer: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                payment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findByCustomer(customerId) {
        return this.prisma.order.findMany({
            where: { customerId },
            include: {
                items: {
                    include: {
                        dish: true,
                    },
                },
                restaurant: true,
                payment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: {
                items: {
                    include: {
                        dish: true,
                    },
                },
                restaurant: true,
                customer: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                payment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_gateway_1.OrdersGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map