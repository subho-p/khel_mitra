export class SocketResponse<T extends object | undefined> {
    success: boolean;
    message?: string;
    data: T | undefined;
    error?: string;

    constructor({
        success = true,
        data = undefined,
        message,
        error,
    }: {
        success: boolean;
        data?: T;
        message?: string;
        error?: string;
    }) {
        this.success = success;
        this.message = message;
        this.data = data || undefined;
        this.error = error;
    }
}
