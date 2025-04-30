import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketRegistryService } from '../share/socket-registry.service';
import { WsException } from '@nestjs/websockets';
import { createNotificationSchema, CreateNotificationSchema } from './schemas';
import { zodValidation } from 'src/libs/utils/zod';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationGatewayService {
    private readonly logger: Logger;
    private _server: Server;

    constructor(
        private readonly socketRegisty: SocketRegistryService,
        private notificationService: NotificationsService,
    ) {
        this.logger = new Logger(NotificationGatewayService.name);
    }

    set server(server: Server) {
        this.logger.debug('Set server');
        this._server = server;
    }

    async sendNewNotification(userId: number, payload: CreateNotificationSchema) {
        const socket = this.socketRegisty.getSocketByUserId(userId);
        if (!socket) {
            throw new WsException('Socket not found');
        }

        const data = zodValidation(createNotificationSchema, payload);
        const notification = await this.notificationService.create(userId, data);

        socket.emit('notification:new', { data: { notification } });
    }
}
