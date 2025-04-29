import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { SocketService } from 'src/libs/services/socket.service';

@Injectable()
export class NotificationGatewayService extends SocketService {
    constructor(jwtService: JwtService, configService: ConfigService) {
        super('NotificationGatewayService', jwtService, configService);
    }

    set server(server: Server) {
        this._server = server;
    }

    sendNewNotification(userId: number, payload: any) {
        const socketId = this.userIdMap.get(userId);
        if (!socketId) {
            this.logger.warn(`No socketId found for userId: ${userId}`);
            return;
        }

        this._server.to(socketId).emit('notification:new', payload);
    }
}
