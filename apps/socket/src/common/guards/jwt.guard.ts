import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ACCESS_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketResponse } from '../classes';
import { extractTokenFromCookies } from '../../utils';

@Injectable()
export class JwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        console.log('access token');
        const client: Socket = context.switchToWs().getClient<Socket>();
        const accessToken = extractTokenFromCookies(client);

        try {
            const data: any = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);

            if (!data) {
                throw new WsException('Invalid access token');
            }

            client.data = {
                user: {
                    id: data?.id,
                    username: data?.username,
                    avatarUrl: data?.avatarUrl,
                },
            };

            return true;
        } catch (error: any) {
            console.log(error?.message);
            client.emit(
                'auth_error',
                new SocketResponse({
                    success: false,
                    error: error?.message || 'Invalid access token',
                }),
            );
            throw new WsException(
                new SocketResponse({
                    success: false,
                    error: error?.message || 'Invalid access token',
                }),
            );
        }
    }
}
