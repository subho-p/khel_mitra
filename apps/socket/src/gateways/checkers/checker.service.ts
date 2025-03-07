import { Injectable, Logger } from '@nestjs/common';
import { CheckersGame, CheckersPlayer } from './classes';
import { TCheckersPiecesMoveSchema } from './schemas';
import { Server } from 'socket.io';
import { GAME_EVENT } from '@khel-mitra/shared/namespace';
import { SocketResponse } from '../../common/classes';

type RoomCode = string;
type RoomId = string;
type PlayerSocketId = string;

@Injectable()
export class CheckersService {
    #rooms: Map<RoomCode, CheckersGame> = new Map();
    #roomCodes: Map<RoomCode, RoomId> = new Map();
    #playerMap: Map<PlayerSocketId, RoomCode> = new Map();
    #server: Server;

    static readonly BoardSize: number = 8;
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(CheckersService.name);
    }

    set server(server: Server) {
        this.#server = server;
    }

    status() {
        const noOfPlayers = this.#playerMap.size;
        const noOfRooms = this.#rooms.size;

        return { noOfPlayers, noOfRooms };
    }

    createNewGame(isRandomPlayer: boolean = false) {
        const room = new CheckersGame(isRandomPlayer);

        this.#rooms.set(room.code, room);
        this.#roomCodes.set(room.code, room.id);
        room.status = 'pending';
        return room;
    }

    // Get random players room
    getRandomRoom(): CheckersGame | undefined {
        const availableRooms = Array.from(this.#rooms.values()).filter(
            (room) => room.status === 'pending' && room.isRandomRoom && room.players.length < 2,
        );
        if (availableRooms.length === 0) {
            return undefined;
        }
        const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
        return randomRoom;
    }

    getRoomByCode(roomCode: string): CheckersGame {
        const room = this.#rooms.get(roomCode);
        if (!room) {
            throw new Error(`Invalid room ${roomCode}`);
        }
        return room;
    }

    isPlayerInRoom(socketId: PlayerSocketId): boolean {
        if (this.#playerMap.has(socketId)) {
            throw new Error(`Player already in a room`);
        }
        return this.#playerMap.has(socketId);
    }

    addPlayer(roomCode: string, player: CheckersPlayer) {
        try {
            // check if player is already in a room
            if (this.isPlayerInRoom(player.socketId)) {
                throw new Error('Player is already in a room');
            }
            const room = this.getRoomByCode(roomCode);

            if (room?.players.length === 2) {
                throw new Error('Room is already full');
            }

            if (room) {
                room.players.push(player);
                this.#playerMap.set(player.socketId, roomCode);
                room.status = 'pending';

                let logRoomCodes: string = '';
                this.#roomCodes.forEach((_, key) => {
                    logRoomCodes += `${key}, `;
                });
                this.logger.debug(`Rooms: ${logRoomCodes}`);
            }

            return room;
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    /**
     * Starts the game
     *
     *
     */
    startGame(roomCode: string) {
        this.#sendInitialRoomData(roomCode);

        setTimeout(() => {
            const room = this.getRoomByCode(roomCode);

            room.status = 'started';
            room.currentPlayerId = room.players[0].id;

            // Start game logic here
            room.initializePieces();

            this.#server
                .to(room.id)
                .emit(GAME_EVENT.START_GAME, new SocketResponse({ success: true, data: { room } }));
        }, 1000);
    }

    restart(roomCode: string) {
        const room = this.getRoomByCode(roomCode);
        room.reset();

        // clear all cell piece
        room.board.forEach((row) => row.forEach((cell) => (cell.piece = undefined)));
        room.isGameOver = false;
        room.switchCurrentPlayer();
        room.winnerId = undefined;
        room.initializePieces();
        this.#server
            .to(room.id)
            .emit(GAME_EVENT.START_GAME, new SocketResponse({ success: true, data: { room } }));
    }

    /**
     * Send pending messages
     */
    #sendInitialRoomData(roomCode: string) {
        const room = this.getRoomByCode(roomCode);

        room.players[0].isAdmin = true;
        room.setInitialStateBoard();
        room.setPlayerColor();
        room.setStatus('pending');
        this.#server
            .to(room.id)
            .emit(GAME_EVENT.INIT_ROOM, new SocketResponse({ success: true, data: { room } }));
    }

    /**
     * Move pieces
     */
    makeMove(socketId: string, data: TCheckersPiecesMoveSchema) {
        try {
            const room = this.getRoomByCode(data.roomCode);
            if (!room) {
                throw new Error('Room not found');
            }
            const player = room.getPlayerBySocketId(socketId);
            if (!room.isCurrentPlayer(player.id)) {
                throw new Error('Not your turn');
            }

            room.movePiece(data.move);
            if (room.checkGameOver()) {
                this.#server
                    .to(room.id)
                    .emit(
                        GAME_EVENT.GAME_OVER,
                        new SocketResponse({ success: true, data: { room } }),
                    );
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An error occurred while making the move. Please try again.');
        }
    }

    /**
     * Remove a player from the player
     */
    removePlayerForDisconnect(socketId: string) {
        const roomCode = this.#playerMap.get(socketId);
        if (!roomCode) {
            return;
        }
        const room = this.getRoomByCode(roomCode);
        if (room) {
            const playerIndex = room.players.findIndex((player) => player.socketId === socketId);
            if (playerIndex >= 0) {
                room.players.splice(playerIndex, 1);
                this.#playerMap.delete(socketId);
            }
        }

        return room;
    }

    deleteRoom(roomCode?: string) {
        if (!roomCode) return;

        const room = this.getRoomByCode(roomCode);
        if (room) {
            this.#rooms.delete(roomCode);
            this.#roomCodes.delete(roomCode);
            this.#playerMap.forEach((code, socketId) => {
                if (code === roomCode) {
                    this.#playerMap.delete(socketId);
                }
            });
        }
    }
}
