import { Logger } from "@nestjs/common";
import { JWTPayloadOfPlayer } from "../types";

export class Player {
    readonly socketId: string;
    readonly id: number;
    username: string;
    tokens: number;
    avatarUrl?: string;
    isAdmin?: boolean;
    isReady?: boolean;
    noOfSkip: number;

    constructor(socketId: string, userData: JWTPayloadOfPlayer) {
        Logger.debug('Player created', Player.name);
        this.id = userData.id;
        this.socketId = socketId;
        this.username = userData.username;
        this.avatarUrl = userData.avatarUrl;
        this.tokens = userData.tokens;
        this.noOfSkip = 0;
    }

    update(field: string, value: any) {
        if (field in this) {
            this[field] = value;
        }
    }

    serializeData() {
        return {
            id: this.id,
            username: this.username,
            avatarUrl: this.avatarUrl,
            tokens: this.tokens,
            noOfSkip: this.noOfSkip,
            isReady: this.isReady,
            isAdmin: this.isAdmin,
        };
    }

    protected sendPlayerAccessToken() {}
}
