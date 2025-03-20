import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TicTacToeRoom } from './classes/ticTacToeRoom.class';
import { generateRoomId } from '../../utils/generateRoomId';
import { getDataFromCookies } from '../../utils';
import { TicTacToePlayer } from './classes/ticTacToePlayer.class';
import { GAME_EVENT } from '@khel-mitra/shared/namespace';
import { SocketResponse } from 'src/common/classes';

type RoomCode = string;

@Injectable()
export class TicTacToeService {
    private _server: Server;
    private readonly logger: Logger;

    private rooms: Map<RoomCode, TicTacToeRoom> = new Map();
    private players: Map<TicTacToePlayer['socketId'], RoomCode> = new Map();

    constructor() {
        this.logger = new Logger(TicTacToeService.name);
    }

    set server(server: Server) {
        this._server = server;
    }

    private generateUniqueRoomId(): string {
        let code: string;

        do {
            code = generateRoomId();
        } while (this.rooms.has(code));
        return code;
    }

    createRoom(client: Socket) {
        try {
            const roomCode = this.generateUniqueRoomId();
            const room = new TicTacToeRoom(roomCode);
            const player = new TicTacToePlayer(client.id, getDataFromCookies(client), 'X');
            this.rooms.set(roomCode, room);
            this.players.set(player.socketId, room.id);
            room.addPlayer(player);
            room.isRandomRoom = false;
            return room;
        } catch (error) {
            this.logger.error(`Error occurred while creating room: ${error.message}`);
            throw error;
        }
    }

    joinRoom(client: Socket, payload: { roomCode: string }) {
        try {
            const roomCode = payload.roomCode;
            const room = this.rooms.get(roomCode);
            const player = new TicTacToePlayer(client.id, getDataFromCookies(client), 'O');
            if (!room) {
                throw new Error('Room not found');
            }
            room.addPlayer(player);
            this.players.set(player.socketId, room.id);

            return room;
        } catch (error) {
            this.logger.error(`Error occurred while joining room: ${error.message}`);
            throw error;
        }
    }

    joinRandomRoom(client: Socket): TicTacToeRoom {
        try {
            let room: TicTacToeRoom;
            const availableRoom = Array.from(this.rooms.values()).find(
                (room) => room.players.length < 2 && room.isRandomRoom,
            );
            if (availableRoom) {
                room = availableRoom;
                room.isRandomRoom = true;
                const player = new TicTacToePlayer(client.id, getDataFromCookies(client), 'O');
                room.addPlayer(player);
                this.players.set(player.socketId, room.id);
                return room;
            } else {
                const newRoom = this.createRoom(client);
                newRoom.isRandomRoom = true;
                return newRoom;
            }
        } catch (error) {
            this.logger.error(`Error occurred while joining random room: ${error.message}`);
            throw error;
        }
    }

    gameCanStart(roomId: string) {
        const room = this.rooms.get(roomId);
        try {
            if (room && room.players.length === 2) {
                room.status = 'started';
                room.currentPlayer = room.players[0];
                this._broadcast(room.id, GAME_EVENT.START_GAME, { room: room.serializeData });
            }
        } catch (error) {
            this.logger.error(`Error occurred while starting game: ${error.message}`);
            throw error;
        }
    }

    leaveRoom(client: Socket) {
        try {
            const roomId = this.players.get(client.id);
            if (!roomId) {
                throw new Error('Probably the player not in a room');
            }
            const room = this.rooms.get(roomId);
            if (!room) {
                throw new Error('Room not found');
            }

            room.players.forEach((player) => {
                this._server
                    .to(player.socketId)
                    .emit(GAME_EVENT.PLAYER_LEAVE, new SocketResponse({ success: true }));
            });
            this.rooms.delete(room.id);
        } catch (error) {
            this.logger.error(`Error occurred while leaving room: ${error.message}`);
            throw error;
        }
    }

    startGame(client: Socket, payload: { roomCode: string }) {
        try {
            const room = this.rooms.get(payload.roomCode);
            if (!room) {
                throw new Error('Room not found');
            }

            if (room.players.length < 2) {
                throw new Error('Not enough players to start the game');
            }

            room.status = 'started';
            room.currentPlayer = room.players[0];
            this._broadcast(room.id, GAME_EVENT.START_GAME, { room: room.serializeData });
        } catch (error) {
            this.logger.error(
                `Error occurred while starting the game: ${error.message}`,
                'TicTacToe',
            );
            throw error;
        }
    }

    restartGame(client: Socket, roomCode: string) {
        const room = this.rooms.get(roomCode);
        if (!room) {
            throw new Error('Room not found');
        }

        room.status = 'pending';
        room.board = Array(9).fill(null);
        room.winnerId = undefined;
        room.players.forEach((player) => {
            if (player.socketId === client.id) {
                player.isReady = true;
            }
        });

        if (room.players.every((player) => player.isReady)) {
            this.gameCanStart(roomCode);
        }

        this._broadcast(room.id, GAME_EVENT.RESTART_GAME, { room: room.serializeData });
    }

    makeMove(client: Socket, payload: { roomCode: string; position: number }) {
        try {
            const room = this.rooms.get(payload.roomCode);
            if (!room) {
                throw new Error('Room not found');
            }

            const player = room.players.find((p) => p.socketId === client.id);
            if (!player) {
                throw new Error('Player not found in room');
            }

            if (room.currentPlayer?.id !== player.id) {
                throw new Error('Not your turn');
            }

            if (room.board[payload.position] !== null) {
                throw new Error('Cell already occupied');
            }

            room.insertPiece(payload.position, player.symbol);
            this._broadcast(room.id, GAME_EVENT.UPDATE_GAME_STATE, {
                board: room.board,
                currentPlayerId: room.currentPlayer?.id,
            });

            this.checkGameOver(room.id);
        } catch (error) {
            this.logger.error(`Error occurred while making a move: ${error.message}`);
            throw error;
        }
    }

    private checkGameOver(id: string) {
        try {
            const room = this.rooms.get(id);
            if (!room) {
                throw new Error('Room not found');
            }
            console.log('checkGameOver');
            const winner = room.checkWin();
            console.log(winner);
            if (winner) {
                room.winnerId = winner.winnerId;
                room.status = 'finished';
                room.players.forEach((player) => {
                    player.noOfWinings += winner.winnerId == player.id ? 1 : 0;
                });
                room.resetPlayersStatus();
                return this._broadcast(room.id, GAME_EVENT.GAME_OVER, {
                    winner: winner.winnerId,
                    winningCombination: winner.winningCombination,
                });
            }
            if (room.isDraw) {
                room.status = 'finished';
                room.resetPlayersStatus();
                return this._broadcast(room.id, GAME_EVENT.GAME_OVER, {
                    winner: null,
                    winningCombination: [],
                });
            }
        } catch (error) {
            this.logger.error(`Error occurred while checking game over: ${error.message}`);
            throw error;
        }
    }

    chat(client: Socket, payload: { roomCode: string; text: string }) {
        try {
            const room = this.rooms.get(payload.roomCode);
            if (!room) {
                throw new Error('Room not found');
            }
            this._broadcast(room.id, GAME_EVENT.CHAT, { text: payload.text }, client.id);
            this.logger.debug(
                `Chat message sent: ${payload.text} by ${client.id} in room ${payload.roomCode}`,
            );
            return new SocketResponse({ success: true });
        } catch (error) {
            this.logger.error(`Error occurred while sending chat message: ${error.message}`);
            throw error;
        }
    }

    private _broadcast(roomId: string, event: string, data?: any, exceptPlayerId?: string) {
        if (exceptPlayerId) {
            this._server
                .to(roomId)
                .to(exceptPlayerId)
                .emit(event, new SocketResponse({ success: true, data }));
        } else {
            this._server.to(roomId).emit(event, new SocketResponse({ success: true, data }));
        }
    }
}
