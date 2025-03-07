import { TPlayer, TUser } from '@khel-mitra/shared/types';
import * as jwt from 'jsonwebtoken';

type SocketPlayer = TPlayer & {
    readonly socketId: string;
};

export class Player implements SocketPlayer {
    readonly socketId: string;
    readonly id: string;
    readonly username: string;
    readonly avatarUrl?: string;

    constructor(socketId: string, user: TUser) {
        if (!user.id || !user.username) {
            throw new Error('Invalid user data: id and username are required');
        }

        this.socketId = socketId;
        this.id = user.id;
        this.username = user.username;
        this.avatarUrl = user.avatarUrl || undefined;
    }

    generatePlayerToken(options: jwt.SignOptions = { expiresIn: '30m' }): string {
        if (!process.env.JWT_PLAYER_ACCESS_SECRET) {
            throw new Error('JWT_PLAYER_ACCESS_SECRET is not defined');
        }

        try {
            const payload = {
                id: this.id,
                username: this.username,
                avatarUrl: this.avatarUrl,
            };

            const token = jwt.sign(payload, process.env.JWT_PLAYER_ACCESS_SECRET, {
                expiresIn: options.expiresIn,
            });
            return token;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Failed to generate player token: invalid JWT configuration');
            }
            throw new Error('Failed to generate player token');
        }
    }

    static verifyPlayerToken(token: string): TUser {
        if (!process.env.JWT_PLAYER_ACCESS_SECRET) {
            throw new Error('JWT_PLAYER_ACCESS_SECRET is not defined');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_PLAYER_ACCESS_SECRET) as TUser;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid or expired player token');
            }
            throw new Error('Failed to verify player token');
        }
    }

    serialize(): TUser {
        return {
            id: this.id,
            username: this.username,
            avatarUrl: this.avatarUrl || undefined,
        };
    }
}