import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketResponse } from '../common/classes';

export const Success = <T extends object | undefined>(
    client: Socket,
    event: string,
    data: T,
    message?: string,
) => {
    const response = new SocketResponse({ success: true, data, message });

    setImmediate(() => {
        client.emit(event, response);
    });

    return response;
};

export const Failure = (client: Socket, event: string, error: any, message?: string) => {
    const errorMessage = error?.message || `Failed - ${event}`;
    const response = new SocketResponse({ success: false, error: errorMessage, message });

    client.emit(event, response);

    return response;
};
