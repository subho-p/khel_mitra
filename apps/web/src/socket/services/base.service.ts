import { socketManager } from "../socket.manager";

export abstract class BaseSocketService {
    protected socket = socketManager;

    constructor() {
        this.registerHandlers();
    }

    protected registerHandlers(): void {}
}
