import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedClients;
    constructor();
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAuthenticate(client: Socket, payload: {
        userId: string;
        role: string;
    }): {
        status: string;
    };
    handleJoinOrderRoom(client: Socket, orderId: string): {
        status: string;
        orderId: string;
    };
    notifyOrderStatusChange(order: any): void;
    notifyNewOrder(order: any): void;
}
