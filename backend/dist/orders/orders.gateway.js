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
exports.OrdersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let OrdersGateway = class OrdersGateway {
    constructor() {
        this.connectedClients = new Map();
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
    }
    handleAuthenticate(client, payload) {
        console.log(`User ${payload.userId} authenticated as ${payload.role}`);
        this.connectedClients.set(client.id, payload.userId);
        if (payload.role === 'RESTAURANT') {
            client.join(`restaurant:${payload.userId}`);
        }
        else if (payload.role === 'CUSTOMER') {
            client.join(`customer:${payload.userId}`);
        }
        else if (payload.role === 'ADMIN') {
            client.join('admin');
        }
        return { status: 'authenticated' };
    }
    handleJoinOrderRoom(client, orderId) {
        client.join(`order:${orderId}`);
        return { status: 'joined', orderId };
    }
    notifyOrderStatusChange(order) {
        const orderId = order.id;
        const status = order.status;
        const restaurantId = order.restaurantId;
        const customerId = order.customerId;
        this.server.to(`order:${orderId}`).emit('orderStatusChanged', {
            orderId,
            status,
            timestamp: new Date().toISOString()
        });
        this.server.to(`restaurant:${restaurantId}`).emit('orderStatusChanged', {
            orderId,
            status,
            timestamp: new Date().toISOString()
        });
        this.server.to(`customer:${customerId}`).emit('orderStatusChanged', {
            orderId,
            status,
            timestamp: new Date().toISOString()
        });
        this.server.to('admin').emit('orderStatusChanged', {
            orderId,
            status,
            restaurantId,
            customerId,
            timestamp: new Date().toISOString()
        });
    }
    notifyNewOrder(order) {
        this.server.to(`restaurant:${order.restaurantId}`).emit('newOrder', {
            orderId: order.id,
            total: order.total,
            timestamp: new Date().toISOString()
        });
        this.server.to('admin').emit('newOrder', {
            orderId: order.id,
            restaurantId: order.restaurantId,
            customerId: order.customerId,
            total: order.total,
            timestamp: new Date().toISOString()
        });
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrdersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('authenticate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleAuthenticate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinOrderRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleJoinOrderRoom", null);
exports.OrdersGateway = OrdersGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [])
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map