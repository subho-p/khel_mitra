import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { io, Socket } from 'socket.io-client';

import { AppModule } from '../src/app.module';
import { CheckerGateway } from '../src/gateways/checkers/checker.gateway';
import { CheckersService } from '../src/gateways/checkers/checker.service';
import {
    ACCESS_TOKEN_NAMESPACE,
    PLAYER_ACCESS_TOKEN_NAMESPACE,
} from '@khel-mitra/shared/constanst';
import { SocketResponse } from '../src/common/classes';
import { CheckersGobalState } from '../src/gateways/checkers/types';
import { GAME_EVENT } from '@khel-mitra/shared/namespace';

const PORT = 3334;

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
async function api(method: Method, url: string, data: any): Promise<{ data: any }> {
    const res = await fetch(`http://localhost:3333/api/v1${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data }),
    });
    return await res.json();
}

async function getAccessToken(email: string, password: string): Promise<string> {
    try {
        const res = await api('POST', '/auth/signin', {
            email,
            password,
        });
        return res.data.accessToken;
    } catch {
        const res = await api('POST', '/auth/signup', {
            email,
            password,
        });
        return res.data.accessToken;
    }
}

const checkersIo = async (email: string, password: string, playerToken: string | undefined) => {
    const accessToken = await getAccessToken(email, password);

    return io(`http://localhost:${PORT}/checkers`, {
        autoConnect: false,
        transports: ['websocket'],
        extraHeaders: {
            cookie: `${ACCESS_TOKEN_NAMESPACE}=${accessToken};`,
        },
        auth: {
            [PLAYER_ACCESS_TOKEN_NAMESPACE]: playerToken,
        },
    });
};

describe('CheckerGateway (e2e)', () => {
    let app: INestApplication;
    let req: request.Agent;

    let checkersGateway: CheckerGateway;
    let checkersService: CheckersService;

    let client1: Socket;
    let client2: Socket;

    let playerTokenOfClient1: string | undefined;
    let playerTokenOfClient2: string | undefined;

    beforeAll(async () => {
        // const moduleRef = await Test.createTestingModule({
        //     imports: [AppModule],
        // }).compile();

        // app = moduleRef.createNestApplication();
        // await app.init();
        // await app.listen(PORT);

        // req = request.agent(`http://localhost:${PORT}`);

        // checkersGateway = moduleRef.get<CheckerGateway>(CheckerGateway);
        // checkersService = moduleRef.get<CheckersService>(CheckersService);

        client1 = await checkersIo('test11@test.com', 'test123', playerTokenOfClient1);
        client2 = await checkersIo('test22@test.com', 'test123', playerTokenOfClient2);

        client1.connect();
        client2.connect();
    });

    afterAll(async () => {
        if (client1.connected) client1.disconnect();
        if (client2.connected) client2.disconnect();

        // await app.close();
    });

    // it('should be defined', () => {
    //     expect(checkersGateway).toBeDefined();
    //     expect(checkersService).toBeDefined();
    // });

    // it('GET /health', () => {
    //     return req.get('/health').expect(200);
    // });

    describe('Connection test ', () => {
        it('should be connect client 1', (done) => {
            client1.on('connect', () => {
                expect(client1.connected).toBe(true);
            });

            done();
        });

        it('Client 1 should be received token', (done) => {
            client1.on('token', (res: SocketResponse<{ token: string }>) => {
                playerTokenOfClient1 = res.data?.token;
                console.log(playerTokenOfClient1);
                expect(playerTokenOfClient1).toBeTruthy();
                done();
            });
        });

        it('should be connect client 2', (done) => {
            client2.on('connect', () => {
                expect(client2.connected).toBe(true);
            });
            done();
        });

        it('Client 2 should be received token', (done) => {
            client2.on('token', (res: SocketResponse<{ token: string }>) => {
                playerTokenOfClient2 = res.data?.token;
                expect(playerTokenOfClient2).toBeTruthy();
                done();
            });
        });

        // it('should be receive game status', (done) => {
        //     client1.emit(GAME_EVENT.GAME_STATUS, (res: SocketResponse<CheckersGobalState>) => {
        //         expect(res.data).toBeTruthy();
        //         done();
        //     });
        // });
    });

    describe('Game rooms', () => {
        let createdRoomCode: string;

        describe('when creating a room', () => {
            it('should create room', (done) => {
                client1.emit(GAME_EVENT.CREATE_ROOM, (res: SocketResponse<object>) => {
                    expect(res.success).toBe(true);
                    expect(res.data).toBeTruthy();
                    if ('roomCode' in res.data!) {
                        createdRoomCode = res.data['roomCode'] as string;
                        expect(createdRoomCode).toBeTruthy();
                        done();
                    }
                });
            });

            it('Should not create a room if it already in room', (done) => {
                client1.emit(GAME_EVENT.CREATE_ROOM, (res: SocketResponse<object>) => {
                    expect(res.success).toBeFalsy();
                    expect(res.message).toBeTruthy();
                    done();
                });
            });
        });

        describe('when joining a room', () => {
            it('should join room', (done) => {
                client2.emit(
                    GAME_EVENT.JOIN_ROOM,
                    { roomCode: createdRoomCode },
                    (res: SocketResponse<object>) => {
                        expect(res.success).toBe(true);
                        expect(res.data).toBeTruthy();
                        done();
                    },
                );
            });

            it('Client 2 should not able to connect join again', () => {
                client2.emit(
                    GAME_EVENT.JOIN_ROOM,
                    { roomCode: createdRoomCode },
                    (res: SocketResponse<object>) => {
                        expect(res.success).toBe(false);
                    },
                );
            });

            it('should be not able to join more than one client', async () => {
                let playerTokenOfClient3: string | undefined;
                const client3 = await checkersIo('test3@test.com', 'test123', playerTokenOfClient3);

                client3.on('token', (res) => {
                    playerTokenOfClient3 = res.data?.token;
                });

                client3.emit(
                    GAME_EVENT.JOIN_ROOM,
                    { roomCode: createdRoomCode },
                    (res: SocketResponse<object>) => {
                        expect(res.success).toBe(false);
                        // expect(res.message).toBeUndefined();
                        expect(res.error).toBeTruthy();
                        client3.disconnect();
                    },
                );
            });
        });

        describe('when leaving a room', () => {
            it('should leave room', (done) => {
                client1.disconnect();
                client2.on(GAME_EVENT.PLAYER_LEAVE, (res: SocketResponse<object>) => {
                    expect(res.success).toBe(true);
                    done();
                });
            });
        });

        describe('when joining random room', () => {
            // it('should join random room client 1', (done) => {
            //     client1.emit(GAME_EVENT.RANDOM_ROOM, (res: SocketResponse<object>) => {
            //         expect(res.success).toBe(true);
            //         expect(res.data).toBeTruthy();
            //         done();
            //     });
            // });

            // it('should join random room client 2', (done) => {
            //     client2.emit(GAME_EVENT.RANDOM_ROOM, (res: SocketResponse<object>) => {
            //         expect(res.success).toBe(true);
            //         expect(res.data).toBeTruthy();
            //         done();
            //     });
            // });

            describe('should initialize game state', () => {
                let roomId: string;

                it('Should game state initialized correctly for client 2', (done) => {
                    client2.on(GAME_EVENT.INIT_ROOM, (res: SocketResponse<any>) => {
                        expect(res.success).toBe(true);
                        expect(res.data).toBeTruthy();
                        expect(res.data.room).toBeTruthy();
                        expect(res.data.room.id).toBeTruthy();

                        expect(res.data.room.id).toBe(roomId);
                        done();
                    });
                });
                it('Should game state initialized correctly for client 1', (done) => {
                    client1.on(GAME_EVENT.INIT_ROOM, (res: SocketResponse<any>) => {
                        roomId = res.data.room.id;
                        expect(res.success).toBe(true);
                        expect(res.data).toBeTruthy();
                        expect(res.data.room).toBeTruthy();
                        expect(res.data.room.id).toBeTruthy();
                        expect(res.data.room.players).toBeTruthy();
                        done();
                    });
                });
            });
        });
    });
});
