import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';
import { TUser } from '@khel-mitra/shared/types';
import { extractTokenFromCookies } from './extractTokenFromCookies';

export const getDataFromCookies = (client: Socket): TUser => {
    try {
        const accessToken = extractTokenFromCookies(client);

        if (!process.env.JWT_ACCESS_SECRET) {
            throw new WsException('JWT_ACCESS_SECRET is not defined');
        }

        const data: unknown = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        if (data && typeof data === 'object' && 'id' in data && 'username' in data) {
            return data as TUser;
        }

        throw new WsException('Invalid access token');
    } catch (error: unknown) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new WsException('Invalid or expired access token');
        } else if (error instanceof WsException) {
            throw error;
        } else {
            throw new WsException('Failed to verify access token');
        }
    }
};