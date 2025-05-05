import { GameInit } from '../schemas';
import { GameStatus } from '../types';
import { generateRoomId } from '../utils';

export abstract class GameRoom {
    id: string;
    protected name: string;
    status: GameStatus;
    protected isRandomRoom: boolean;
    protected maxPlayers: number;
    protected createdAt: number;
    protected updatedAt: number;
    protected maxSkip: number;
    tokens: number;

    constructor(name: string, isRandomRoom: boolean = false) {
        this.id = generateRoomId();
        this.name = name;
        this.status = 'Idle';
        this.isRandomRoom = isRandomRoom;
        this.maxPlayers = 2;
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
        this.tokens = 100;
    }

    abstract initGame( data: GameInit): void;

    abstract startGame(): void;

    abstract endGame(): void;

    abstract makeMove(): void;

    abstract leaveGame(): void;

    abstract joinGame(): void;

    abstract deleteGame(): void;

    abstract getRoom(): void;

    abstract deleteRoom(): void;
}
