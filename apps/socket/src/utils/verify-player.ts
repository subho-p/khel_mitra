import { PLAYER_ACCESS_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';
import { TPlayer } from '@khel-mitra/shared/types';
import { WsException } from '@nestjs/websockets';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { Failure } from './response';

export const verifyPlayer = (socket: Socket) => {
    try {
        const playerAccessToken = socket.handshake.auth[PLAYER_ACCESS_TOKEN_NAMESPACE];
        if (!playerAccessToken) {
            throw new WsException('Player access token not found');
        }

        const playerData: TPlayer = jwt.verify(
            playerAccessToken as string,
            process.env.JWT_PLAYER_ACCESS_SECRET!,
        ) as TPlayer;

        socket.data.player = playerData;
    } catch (error) {
        return Failure(socket, 'token', error);
    }
};
