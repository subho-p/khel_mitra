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
import { SocketRegistryService } from '../share/socket-registry.service';

@WebSocketGateway({
    cors: { credentials: true, origin: '*' },
    transports: ['websocket'],
})
export class NotificationGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private readonly service: NotificationGatewayService,
        private readonly socketRegistry: SocketRegistryService,
    ) {}

    onModuleInit() {
        this.service.server = this.server;
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.socketRegistry.registerClient(client);
    }

    handleDisconnect(client: Socket) {
        this.socketRegistry.unRegisterClient(client);
    }

    async sendNotification(userId: number, payload: any) {
        await this.service.sendNewNotification(userId, payload);
    }

    @SubscribeMessage('notification:ping')
    handlePing(@ConnectedSocket() socket: Socket, @MessageBody() payload: any) {
        console.log(payload);
        socket.emit('notification:pong', { message: 'pong' });
    }

    @SubscribeMessage('notification:status')
    notificationStatus() {}
}
