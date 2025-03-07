import { TCheckersPieceColor, TCheckersPlayer, TPlayer, TUser } from '@khel-mitra/shared/types';
import { Player } from '../../../common/classes/player.class';
import { Socket } from 'socket.io';

export class CheckersPlayer extends Player implements TCheckersPlayer {
    readonly socketId: string;
    id: string;
    username: string;
    avatarUrl?: string;
    color: TCheckersPieceColor;
    isAdmin?: boolean;
    isReady?: boolean;

    constructor(socketId:string, data: TUser) {
        super(socketId, data);
    }

    setColor(color: TCheckersPieceColor) {
        this.color = color;
    }

    setIsAdmin(isAdmin: boolean) {
        this.isAdmin = isAdmin;
    }

    setIsReady(isReady: boolean) {
        this.isReady = isReady;
    }

    get() {
        return {
            id: this.id,
            username: this.username,
            avatarUrl: this.avatarUrl,
            color: this.color,
            isAdmin: this.isAdmin,
        };
    }

    update(data: Partial<TCheckersPlayer>) {
        if (data.isAdmin !== undefined) this.isAdmin = data.isAdmin;
        if (data.isReady !== undefined) this.isReady = data.isReady;
        if (data.avatarUrl !== undefined) this.avatarUrl = data.avatarUrl;
    }
}
