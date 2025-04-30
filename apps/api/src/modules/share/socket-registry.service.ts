import { ACCESS_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class SocketRegistryService {
    private readonly logger: Logger;

    // userId -> socket
    private users: Map<number, Socket> = new Map();
    // socket -> userId
    private sockets: Map<string, number> = new Map();

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.logger = new Logger('SocketRegistryService');
    }

    registerClient(client: Socket) {
        const data = this.getUserData(client);
        if (!data) {
            this.logger.warn(`Failed to register client: ${client.id} (no user id)`);
            return;
        }
        const { id: userId, username } = data;

        if (!this.users.has(userId)) {
            this.users.set(userId, client);
        }
        this.sockets.set(client.id, userId);
        this.logger.debug(`Client registered: ${client.id} - User: ${userId}`);

        client.emit('app:toast', {
            data: {
                title: `Welcome back ${username}`,
                description: this.greetingMessage(),
            },
        });
    }

    private greetingMessage() {
        const time = new Date().getHours();
        console.log(time);

        const messages = [
            { time: 12, message: 'Good Morning!' },
            { time: 16, message: 'Good Afternoon!' },
            { time: 20, message: 'Good Evening!' },
        ];

        return messages.find((m) => m.time > time)?.message;
    }

    unRegisterClient(client: Socket) {
        const data = this.getUserData(client);
        if (!data) {
            this.logger.warn(`Failed to unregister client: ${client.id}`);
            return;
        }
        const { id: userId } = data;

        if (!this.users.has(userId)) {
            this.logger.warn(`No socketId found for userId: ${userId}`);
            return;
        }

        this.users.delete(userId);
        this.sockets.delete(client.id);

        this.logger.debug(`Client unregistered: ${client.id} - User: ${userId}`);
    }

    getSocketByUserId(id: number) {
        return this.users.get(id);
    }

    private getAccessToken(socket: Socket) {
        const coookie = socket.handshake.headers.cookie;
        const accessToken = coookie
            ?.split(';')
            .find((c) => c.trim().startsWith(`${ACCESS_TOKEN_NAMESPACE}=`))
            ?.split('=')[1];
        if (!accessToken) return null;

        return accessToken;
    }

    private getUserData(socket: Socket) {
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

            const username = decodedAccessToken?.username;
            return {
                id: Number(userId),
                username,
            };
        } catch {
            this.logger.warn('Invalid access token (getUserId)');
            return null;
        }
    }

    protected checkUser(socket: Socket): boolean {
        const data = this.getUserData(socket);
        return !!data;
    }
}
