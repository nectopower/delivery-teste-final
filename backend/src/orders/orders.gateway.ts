import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, string>(); // socketId -> userId

  constructor() {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(client: Socket, payload: { userId: string, role: string }) {
    console.log(`User ${payload.userId} authenticated as ${payload.role}`);
    this.connectedClients.set(client.id, payload.userId);
    
    // Join rooms based on role
    if (payload.role === 'RESTAURANT') {
      client.join(`restaurant:${payload.userId}`);
    } else if (payload.role === 'CUSTOMER') {
      client.join(`customer:${payload.userId}`);
    } else if (payload.role === 'ADMIN') {
      client.join('admin');
    }
    
    return { status: 'authenticated' };
  }

  @SubscribeMessage('joinOrderRoom')
  handleJoinOrderRoom(client: Socket, orderId: string) {
    client.join(`order:${orderId}`);
    return { status: 'joined', orderId };
  }

  notifyOrderStatusChange(order: any) {
    const orderId = order.id;
    const status = order.status;
    const restaurantId = order.restaurantId;
    const customerId = order.customerId;

    // Notify specific order room
    this.server.to(`order:${orderId}`).emit('orderStatusChanged', {
      orderId,
      status,
      timestamp: new Date().toISOString()
    });
    
    // Notify restaurant
    this.server.to(`restaurant:${restaurantId}`).emit('orderStatusChanged', {
      orderId,
      status,
      timestamp: new Date().toISOString()
    });
    
    // Notify customer
    this.server.to(`customer:${customerId}`).emit('orderStatusChanged', {
      orderId,
      status,
      timestamp: new Date().toISOString()
    });
    
    // Notify admins
    this.server.to('admin').emit('orderStatusChanged', {
      orderId,
      status,
      restaurantId,
      customerId,
      timestamp: new Date().toISOString()
    });
  }

  notifyNewOrder(order: any) {
    // Notify restaurant
    this.server.to(`restaurant:${order.restaurantId}`).emit('newOrder', {
      orderId: order.id,
      total: order.total,
      timestamp: new Date().toISOString()
    });
    
    // Notify admins
    this.server.to('admin').emit('newOrder', {
      orderId: order.id,
      restaurantId: order.restaurantId,
      customerId: order.customerId,
      total: order.total,
      timestamp: new Date().toISOString()
    });
  }
}
