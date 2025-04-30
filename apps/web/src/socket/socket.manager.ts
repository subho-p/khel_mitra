import { io, Socket } from "socket.io-client";

type SocketEventHandler = {
    event: string;
    handler: (...args: any[]) => void;
};

export class SocketManager {
    private static instance: SocketManager;
    private socket: Socket | null = null;
    private registeredHandlers: SocketEventHandler[] = [];

    constructor() {}

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }

        return SocketManager.instance;
    }

    public connect() {
        if (this.socket && this.socket.connected) {
            console.log("Socket already connected");
            return;
        }

        this.socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        this.socket.on("connect", () => {
            console.log("Socket connected:", this.socket?.id);
        });

        this.socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        this.socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
        });
    }

    public registerEvent(event: string, handler: (...args: any[]) => void) {
        this.registeredHandlers.push({ event, handler });

        if (this.socket && this.socket.connected) {
            this.socket.on(event, handler);
        }
    }

    private registerHandlers() {
        if (!this.socket) {
            return;
        }

        this.registeredHandlers.forEach(({ event, handler }) => {
            this.socket?.on(event, handler);
        });
    }

    public emit(event: string, data: any) {
        if (!this.socket) throw new Error("Socket not connected");

        this.socket.emit(event, data);
    }

    public off(event: string, handler: (...args: any[]) => void) {
        if (!this.socket) throw new Error("Socket not connected");

        this.socket.off(event, handler);
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.registeredHandlers = [];

            console.log("Socket disconnected");
        }
    }

    public isConnected() {
        return this.socket?.connected ?? false;
    }
}

export const socketManager = SocketManager.getInstance();
