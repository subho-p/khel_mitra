import { SocketManager } from "../socket.manager";
import { BaseSocketService } from "./base.service";

export class NotificationService extends BaseSocketService {
    protected socket: SocketManager;
    private startWith = "notification:";

    constructor() {
        super();
        this.socket = SocketManager.getInstance();
    }

    on(event: string, handler: (...args: any[]) => void) {
        this.socket.registerEvent(`${this.startWith}${event}`, handler);
    }

    emit<T>(event: string, payload: T) {
        this.socket.emit(`${this.startWith}${event}`, payload);
    }

    off(event: string, handler: (...args: any[]) => void) {
        this.socket.off(`${this.startWith}${event}`, handler);
    }

    disconnect() {
        this.socket.disconnect();
    }
}

export const notificationService = new NotificationService();
