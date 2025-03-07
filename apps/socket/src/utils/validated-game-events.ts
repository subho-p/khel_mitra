import { Socket } from 'socket.io';
import { SocketResponse } from '../common/classes';
import { GAME_EVENT } from '@khel-mitra/shared/namespace';

export const validatedGameEvents = (socket: Socket) => {
    socket.onAny((event: GAME_EVENT, ...args: any) => {
        const isValidEvent = Object.values(GAME_EVENT).includes(event);
        if (!isValidEvent) {
            const errorResponze = new SocketResponse({
                success: false,
                error: `Invalid event - "${event}"`,
            });

            const callback = args[args.length - 1];
            if (typeof callback === 'function') {
                callback(errorResponze);
            } else {
                socket.emit(GAME_EVENT.ERROR_EVENT, errorResponze);
            }
            return;
        }
    });
};
