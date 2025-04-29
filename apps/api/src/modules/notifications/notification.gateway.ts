import { OnModuleInit } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationGatewayService } from './notification.gateway.service';

@WebSocketGateway({
    cors: { credentials: true, origin: '*' },
    transports: ['websocket'],
    
})
export class NotificationGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly service: NotificationGatewayService) {}

    onModuleInit() {
        this.service.server = this.server;
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.service.registerClient(client);
    }

    handleDisconnect(client: Socket) {
        this.service.unRegisterClient(client);
    }

    sendNotification(userId: number, payload: any) {
        this.service.sendNewNotification(userId, payload);
    }

    @SubscribeMessage('notification:ping')
    handlePing(@ConnectedSocket() socket: Socket, @MessageBody() payload: any) {
        console.log(payload);
        socket.emit('notification:pong', { message: 'pong' });
    }

    @SubscribeMessage('notification:status')
    notificationStatus() {}
}
