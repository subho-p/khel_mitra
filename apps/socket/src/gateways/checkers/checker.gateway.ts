import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';
import { CheckersService } from './checker.service';

import jwt from 'jsonwebtoken';
import { Failure, getDataFromCookies, Success } from '../../utils';

import { CheckersGobalState } from './types';
import { checkerGatewayOptions } from '../../constants';
import { CheckersGame, CheckersPlayer } from './classes';
import { Player, SocketResponse } from '../../common/classes';
import { CheckersPiecesMoveSchema, JoinRoomSchema, RoomCodeSchema } from './schemas';

import { TPlayer } from '@khel-mitra/shared/types';
import { GAME_EVENT } from '@khel-mitra/shared/namespace/socket';
import { PLAYER_ACCESS_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';

@WebSocketGateway(checkerGatewayOptions)
export class CheckerGateway implements OnGatewayConnection, OnModuleInit, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private checkerService: CheckersService) {}

    handleConnection(client: Socket) {
        try {
            const userData = getDataFromCookies(client);
            const newPlayer = new Player(client.id, userData);
            const token = newPlayer.generatePlayerToken();
            Logger.debug(`Connection established on ${client.id}`, 'Checkers');
            return Success(client, 'token', { token });
        } catch (error) {
            Logger.error(`Error occurred while connecting: ${error.message}`, 'Checkers');
            if (error instanceof WsException) {
                client.emit('auth_error', { success: false, error: error.message });
            } else {
                client.emit('auth_error', { success: false, error: 'Internal server error' });
            }
            client.disconnect(true);
        }
    }

    /**
     * Validate the gateway events and pass
     */
    onModuleInit() {
        this.checkerService.server = this.server;

        //     // Middleware for event validation
        // this.server.use((socket: Socket, next) => {
        //     this.validateEvent(socket, next);
        // });

        //     // Middleware for token verification
        //     this.server.use((socket: Socket, next) => {
        //         this.verifyPlayerToken(socket, next);
        //     });

        //     // // Handle connection
        // this.server.on('connection', (socket: Socket) => {
        //     // Handle connection errors
        //     socket.on('error', (error) => {
        //         Logger.error(`Connection error: ${error.message}`, 'CheckerGateway');
        //         socket.disconnect(true); // Disconnect the client on error
        //     });

        //     Logger.debug(`Client connected: ${socket.id}`, 'CheckerGateway');

        //     // Handle disconnection
        //     socket.on('disconnect', () => {
        //         Logger.debug(`Client disconnected: ${socket.id}`, 'CheckerGateway');
        //     });
        // });
    }

    private validateEvent(socket: Socket, next: (err?: Error) => void) {
        socket.use(([event, ...args], next) => {
            const isValidEvent = Object.values(GAME_EVENT).includes(event as GAME_EVENT);

            if (!isValidEvent) {
                const errorResponse = new SocketResponse({
                    success: false,
                    error: `Invalid event - "${event}"`,
                });

                const callback = args[args.length - 1];
                if (typeof callback === 'function') {
                    callback(errorResponse);
                } else {
                    socket.emit(GAME_EVENT.ERROR_EVENT, errorResponse);
                }
                return next(new Error(`Invalid event: ${event}`));
            }
        });
        next();
    }

    private verifyPlayerToken(socket: Socket, next: (err?: Error) => void) {
        try {
            const playerAccessToken = socket.handshake.auth[PLAYER_ACCESS_TOKEN_NAMESPACE];
            Logger.debug(
                `Player access token :: ${playerAccessToken}`,
                'Checkers-playerAccessToken',
            );
            if (!playerAccessToken) {
                throw new WsException('Player access token not found');
            }

            const playerData: TPlayer = jwt.verify(
                playerAccessToken as string,
                process.env.JWT_PLAYER_ACCESS_SECRET!,
            ) as TPlayer;

            socket.data.user = playerData;

            // Proceed to the next middleware
            next();
        } catch (error: unknown) {
            if (error instanceof jwt.JsonWebTokenError) {
                // Pass the error to the next middleware
                return next(new WsException('Invalid or expired access token'));
            }
            // Pass the error to the next middleware
            return next(new WsException('Failed to verify access token'));
        }
    }

    private handleError(socket: Socket, error: Error) {
        Logger.error(`Error: ${error.message}`, 'CheckerGateway');

        const errorResponse = new SocketResponse({
            success: false,
            error: error.message,
        });

        socket.emit(GAME_EVENT.ERROR_EVENT, errorResponse);
        socket.disconnect(true); // Disconnect the client on error
    }

    handleDisconnect(client: Socket) {
        Logger.debug(`Disconnect ${client.id}`, 'Checkers');
        const room = this.checkerService.removePlayerForDisconnect(client.id);

        // Broadcast client - player leave
        room?.players.forEach((player) =>
            this.server
                .to(player.socketId)
                .emit(GAME_EVENT.PLAYER_LEAVE, new SocketResponse({ success: true })),
        );

        this.checkerService.deleteRoom(room?.code);
    }

    // Status
    @SubscribeMessage(GAME_EVENT.GAME_STATUS)
    gameStatus(): SocketResponse<CheckersGobalState> {
        const status = this.checkerService.status();

        return new SocketResponse({ success: true, data: status });
    }

    @SubscribeMessage(GAME_EVENT.CREATE_ROOM)
    async createRoom(client: Socket) {
        try {
            this.checkerService.isPlayerInRoom(client.id);

            const player = new CheckersPlayer(client.id, getDataFromCookies(client));
            const room = this.checkerService.createNewGame();
            this.checkerService.addPlayer(room.code, player);
            await client.join(room.id);

            return Success(client, GAME_EVENT.CREATE_ROOM, {
                player,
                roomCode: room.code,
            });
        } catch (error) {
            return Failure(client, GAME_EVENT.CREATE_ROOM, error, 'Failed to create room');
        }
    }

    @SubscribeMessage(GAME_EVENT.JOIN_ROOM)
    async joinRoom(client: Socket, payload: any) {
        try {
            this.checkerService.isPlayerInRoom(client.id);

            const player = new CheckersPlayer(client.id, getDataFromCookies(client));
            const { data, success } = JoinRoomSchema.safeParse(payload);
            if (!success) {
                throw new WsException('Invalid room code');
            }

            const room = this.checkerService.getRoomByCode(data.roomCode);

            // Check if room is full
            if (room.players.length === 2) {
                throw new WsException('Room is full');
            }

            // Add player to room
            this.checkerService.addPlayer(room.code, player);
            await client.join(room.id);

            setImmediate(() => this.gameCanStart(room));

            return Success(client, GAME_EVENT.JOIN_ROOM, {
                player,
                roomCode: room.code,
            });
        } catch (error) {
            return Failure(client, GAME_EVENT.JOIN_ROOM, error, 'Failed to join room');
        }
    }

    @SubscribeMessage(GAME_EVENT.RANDOM_ROOM)
    async randomRoomJoin(client: Socket) {
        try {
            this.checkerService.isPlayerInRoom(client.id);

            const player = new CheckersPlayer(client.id, getDataFromCookies(client));

            let room: CheckersGame;
            const randomRoom = this.checkerService.getRandomRoom();
            if (randomRoom) {
                room = randomRoom;
            } else {
                room = this.checkerService.createNewGame(true);
            }

            this.checkerService.addPlayer(room.code, player);
            await client.join(room.id);

            setImmediate(() => this.gameCanStart(room));

            return Success(client, GAME_EVENT.JOIN_ROOM, {
                player,
                roomCode: room.code,
            });
        } catch (error) {
            return Failure(client, GAME_EVENT.RANDOM_ROOM, error, 'Failed to join random room');
        }
    }

    /**
     *
     * @param room - Room to check
     */
    private gameCanStart(room: CheckersGame): void {
        if (room.players.length === 2) {
            this.checkerService.startGame(room.code);
        }
    }

    /**
     *
     * @param client
     * @param payload
     */
    @SubscribeMessage(GAME_EVENT.MOVE_PIECE)
    move(client: Socket, payload: any) {
        try {
            const validatedData = CheckersPiecesMoveSchema.safeParse(payload);
            if (!validatedData.success) {
                const error = validatedData.error.errors[0].message || 'Invalid move data';
                throw new WsException(error);
            }

            const data = validatedData.data;
            this.checkerService.makeMove(client.id, data);
            const room = this.checkerService.getRoomByCode(data.roomCode);

            this.server
                .to(room.id)
                .emit(
                    GAME_EVENT.UPDATE_ROOM_STATE,
                    new SocketResponse({ success: true, data: { room } }),
                );
        } catch (error) {
            return Failure(client, GAME_EVENT.MOVE_PIECE, error, 'Failed to move piece');
        }
    }

    // ----------------------------------------------------------------
    @SubscribeMessage(GAME_EVENT.PLAYER_LEAVE)
    leaveRoom(client: Socket, payload: any) {
        console.log('leaveRoom', payload);
    }

    @SubscribeMessage(GAME_EVENT.PLAYER_READY)
    ready(client: Socket, payload: unknown) {
        try {
            const validatedData = RoomCodeSchema.safeParse(payload);
            if (!validatedData.success) {
                const error = validatedData.error.errors[0].message || 'Invalid ready data';
                throw new WsException(error);
            }
            const roomCode = validatedData.data.roomCode;

            const room = this.checkerService.getRoomByCode(roomCode);
            if (!room) {
                throw new WsException('Room not found');
            }
            
            room.players.map((player) => player.socketId === client.id && (player.isReady = true));

            const isBothPlayersReady = room.players.every((player) => player.isReady);
            if (isBothPlayersReady) {
                this.checkerService.restart(roomCode);
            }
        } catch (error) {
            return Failure(client, GAME_EVENT.PLAYER_READY, error, 'Failed to ready');
        }
    }

    @SubscribeMessage(GAME_EVENT.CAPTURE_PIECE)
    capture(client: Socket, payload: any) {
        console.log('capture', payload);
    }

    @SubscribeMessage(GAME_EVENT.RESIGN_GAME)
    resign(client: Socket, payload: any) {
        console.log('resign', payload);
    }

    @SubscribeMessage(GAME_EVENT.RESTART_GAME)
    restart(client: Socket, payload: any) {
        console.log('restart', payload);
    }

    @SubscribeMessage(GAME_EVENT.CHAT)
    chat(client: Socket, payload: any) {
        console.log('chat', payload);
    }
}
