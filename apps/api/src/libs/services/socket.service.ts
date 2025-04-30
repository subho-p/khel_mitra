import { ACCESS_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

export abstract class SocketService {
    protected _server: Server;
    protected readonly logger: Logger;

    protected userIdMap: Map<number, string> = new Map<number, string>();

    constructor(
        contextName: string,
        protected jwtService: JwtService,
        private configService: ConfigService,
    ) {
        this.logger = new Logger(contextName);
    }

    broadcast(event: string, payload: any) {
        this._server.emit(event, payload);
    }

    sendToClient(userId: number, event: string, payload: any) {
        const socketId = this.userIdMap.get(userId);
        if (!socketId) {
            this.logger.warn(`No socketId found for userId: ${userId}`);
            return;
        }

        this._server.to(socketId).emit(event, payload);
    }

    registerClient(client: Socket) {
        const userId = this.getUserId(client);
        if (!userId) {
            this.logger.warn(`Failed to register client: ${client.id} (no user id)`);
            return;
        }

        this.userIdMap.set(userId, client.id);
        this.logger.debug(`Client registered: ${client.id} - User: ${userId}`);
    }

    unRegisterClient(client: Socket) {
        const userId = this.getUserId(client);
        if (!userId) {
            this.logger.warn(`Failed to unregister client: ${client.id}`);
            return;
        }

        if (!this.userIdMap.has(userId)) {
            this.logger.warn(`No socketId found for userId: ${userId}`);
            return;
        }

        this.userIdMap.delete(userId);
        this.logger.debug(`Client unregistered: ${client.id} - User: ${userId}`);
    }

    protected getAccessToken(socket: Socket): string | null {
        const coookie = socket.handshake.headers.cookie;
        const accessToken = coookie
            ?.split(';')
            .find((c) => c.trim().startsWith(`${ACCESS_TOKEN_NAMESPACE}=`))
            ?.split('=')[1];
        if (!accessToken) return null;

        return accessToken;
    }

    protected getUserId(socket: Socket): number | null {
        const accessToken = this.getAccessToken(socket);
        if (!accessToken) {
            this.logger.warn('No access token found (getUserId)');
            return null;
        }

        try {
            const decodedAccessToken = this.jwtService.verify(accessToken, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            });
            if (!decodedAccessToken) {
                this.logger.warn('Invalid access token (getUserId)');
                return null;
            }

            const userId = decodedAccessToken.sub || decodedAccessToken.id;
            if (!userId) {
                this.logger.warn('No user id found (getUserId)');
                return null;
            }

            return Number(userId);
        } catch {
            this.logger.warn('Invalid access token (getUserId)');
            return null;
        }
    }

    protected checkUser(socket: Socket): boolean {
        const userId = this.getUserId(socket);
        return !!userId;
    }
}
