import { GatewayMetadata } from "@nestjs/websockets";

export const checkerGatewayOptions: GatewayMetadata = {
    cors: { origin: 'http://localhost:3334/checkers' },
    namespace: 'checkers',
    transports: ['websocket'],
};

export const CHECKERS_BOARD_SIZE = 8