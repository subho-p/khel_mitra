import {
    ACCESS_TOKEN_NAMESPACE,
    PLAYER_ACCESS_TOKEN_NAMESPACE,
} from '@khel-mitra/shared/constanst';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { io, Socket } from 'socket.io-client';
import { AppModule } from 'src/app.module';
import { TicTacToeGateway } from 'src/gateways/tic-tac-toe/ticTacToe.gateway';
import { TicTacToeService } from 'src/gateways/tic-tac-toe/types';

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

describe('Tic tac toe', function () {
    let app: INestApplication;

    let tttGateway: TicTacToeGateway;
    let tttService: TicTacToeService;

    let client1: Socket;
    let client2: Socket;

    let playerTokenOfClient1: string | undefined;
    let playerTokenOfClient2: string | undefined;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
        await app.listen(PORT);

        tttGateway = moduleRef.get<TicTacToeGateway>(TicTacToeGateway);
        tttService = moduleRef.get<TicTacToeService>(TicTacToeService);

        client1 = await checkersIo('test11@test.com', 'test123', playerTokenOfClient1);
        client2 = await checkersIo('test22@test.com', 'test123', playerTokenOfClient2);

        client1.connect();
        client2.connect();
    });

    afterAll(async () => {
        if (client1.connected) client1.disconnect();
        if (client2.connected) client2.disconnect();

        await app.close();
    });

    it('Should be defined', () => {
        expect(tttGateway).toBeDefined();
        expect(tttService).toBeDefined();
    });
});
