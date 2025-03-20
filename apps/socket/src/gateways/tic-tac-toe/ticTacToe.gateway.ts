import { Logger, OnModuleInit } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Player } from '../../common/classes';
import { TicTacToeService } from './ticTacToe.service';
import { GAME_EVENT } from '@khel-mitra/shared/namespace';
import { Failure, getDataFromCookies, Success } from '../../utils';

@WebSocketGateway({
    cors: { origin: 'http://localhost:3334/tic-tac-toe' },
    namespace: 'tic-tac-toe',
    transports: ['websocket'],
})
export class TicTacToeGateway implements OnGatewayConnection, OnModuleInit, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private readonly logger: Logger;

    constructor(private ticTacToeService: TicTacToeService) {
        this.logger = new Logger(TicTacToeGateway.name);
    }

    handleConnection(client: Socket) {
        try {
            const userData = getDataFromCookies(client);
            const newPlayer = new Player(client.id, userData);
            const token = newPlayer.generatePlayerToken();
            this.logger.debug(`Connection established on ${client.id}`);
            return Success(client, 'token', { token });
        } catch (error) {
            this.logger.error(`Error occurred while connecting: ${error.message}`, 'TicTacToe');
            if (error instanceof WsException) {
                client.emit('auth_error', { success: false, error: error.message });
            } else {
                client.emit('auth_error', { success: false, error: 'Internal server error' });
            }
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        try {
            this.ticTacToeService.leaveRoom(client);
        } catch (error) {
            this.logger.error(`Error occurred while disconnecting: ${error.message}`);
        }
    }

    onModuleInit() {
        this.logger.log('TicTacToeGateway initialized');
        this.ticTacToeService.server = this.server;
    }

    @SubscribeMessage(GAME_EVENT.CREATE_ROOM)
    async createRoom(client: Socket) {
        try {
            const room = this.ticTacToeService.createRoom(client);
            await client.join(room.id);
            return Success(client, GAME_EVENT.INIT_ROOM, {
                room,
                player: room.players[0],
            });
        } catch (error) {
            this.logger.error(`Error occurred while creating room: ${error}`);
            return Failure(client, GAME_EVENT.INIT_ROOM, error, 'Failed to create room');
        }
    }

    @SubscribeMessage(GAME_EVENT.JOIN_ROOM)
    async joinRoom(client: Socket, payload: { roomCode: string }) {
        try {
            const room = this.ticTacToeService.joinRoom(client, payload);
            await client.join(room.id);
            setImmediate(() => this.ticTacToeService.gameCanStart(room.id));
            return Success(client, GAME_EVENT.INIT_ROOM, {
                room,
                player: room.players[1],
            });
        } catch (error) {
            this.logger.error(`Error occurred while joining room: ${error}`);
            return Failure(client, GAME_EVENT.INIT_ROOM, error, 'Failed to join room');
        }
    }

    @SubscribeMessage(GAME_EVENT.RANDOM_ROOM)
    async randomRoom(client: Socket) {
        try {
            const room = this.ticTacToeService.joinRandomRoom(client);
            await client.join(room.id);
            setImmediate(() => this.ticTacToeService.gameCanStart(room.id));
            return Success(client, GAME_EVENT.INIT_ROOM, {
                room,
                player: room.players.find((player) => player.socketId === client.id),
            });
        } catch (error) {
            this.logger.error(`Error occurred while joining random room: ${error}`);
            return Failure(client, GAME_EVENT.INIT_ROOM, error, 'Failed to join random room');
        }
    }

    @SubscribeMessage(GAME_EVENT.MOVE_PIECE)
    movePiece(client: Socket, payload: { roomCode: string; position: number }) {
        try {
            this.ticTacToeService.makeMove(client, payload);
            return Success(client, GAME_EVENT.MOVE_PIECE, { success: true });
        } catch (error) {
            this.logger.error(`Error occurred while making a move: ${error}`);
            return Failure(client, GAME_EVENT.MOVE_PIECE, error, 'Failed to make move');
        }
    }

    @SubscribeMessage(GAME_EVENT.START_GAME)
    startGame(client: Socket, payload: { roomCode: string }) {
        try {
            this.ticTacToeService.startGame(client, payload);
            return Success(client, GAME_EVENT.START_GAME, { success: true });
        } catch (error) {
            this.logger.error(`Error occurred while starting the game: ${error}`);
            return Failure(client, GAME_EVENT.START_GAME, error, 'Failed to start game');
        }
    }

    @SubscribeMessage(GAME_EVENT.PLAYER_LEAVE)
    leaveRoom(client: Socket) {
        try {
            this.ticTacToeService.leaveRoom(client);
            return Success(client, GAME_EVENT.PLAYER_LEAVE, { success: true });
        } catch (error) {
            this.logger.error(`Error occurred while leaving the room: ${error}`);
            return Failure(client, GAME_EVENT.PLAYER_LEAVE, error, 'Failed to leave room');
        }
    }

    @SubscribeMessage(GAME_EVENT.RESTART_GAME)
    restartGame(client: Socket, payload: { roomCode: string }) {
        try {
            this.ticTacToeService.restartGame(client, payload.roomCode);
            // return Success(client, GAME_EVENT.RESTART_GAME, { success: true });
        } catch (error) {
            this.logger.error(`Error occurred while restarting the game: ${error}`);
            return Failure(client, GAME_EVENT.RESTART_GAME, error, 'Failed to restart game');
        }
    }

    @SubscribeMessage('chat')
    chat(client: Socket, payload: { roomCode: string; text: string }) {
        try {
            this.ticTacToeService.chat(client, payload);
            return Success(client, 'chat', { success: true });
        } catch (error) {
            this.logger.error(`Error occurred while sending chat message: ${error}`);
            return Failure(client, 'chat', error, 'Failed to send chat message');
        }
    }
}
