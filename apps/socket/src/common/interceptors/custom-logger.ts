import { Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces';
import { WsException } from '@nestjs/websockets';
import { SocketResponse } from '../classes';
import { Socket } from 'socket.io';

@Catch(WsException)
export class CustomLoggerFilter implements ExceptionFilter {
    private readonly logger = new Logger(CustomLoggerFilter.name);

    catch(exception: WsException, host: ArgumentsHost) {
        const wsHost = host.switchToWs();
        const client: Socket = wsHost.getClient();
        const data = wsHost.getData();

        this.logger.error(`���️ [${client.id}] ${JSON.stringify(data)} - ${exception.message}`);

        client.emit(
            'error',
            new SocketResponse({
                success: false,
                error: exception.message,
            }),
        );

        throw new WsException(exception.message);
    }
}
