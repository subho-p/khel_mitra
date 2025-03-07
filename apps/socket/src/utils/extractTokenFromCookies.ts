import { ACCESS_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export function extractTokenFromCookies(client: Socket) {
    try {
        const cookieHeader = client.handshake.headers.cookie;
        if (!cookieHeader) {
            throw new WsException('Cookie header not found');
        }
        const token = cookieHeader
            .split(';')
            .find((c) => c.trim().startsWith(`${ACCESS_TOKEN_NAMESPACE}=`))
            ?.split('=')[1];

        if (!token) {
            throw new WsException('Access token not found');
        }

        return token;
    } catch (error: unknown) {
        if (error instanceof WsException) {
            throw error;
        }
        throw new WsException('Access token not found');
    }
}
