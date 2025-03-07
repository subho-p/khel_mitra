import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { TCheckersPlayer } from "@khel-mitra/shared/types";

export interface SocketResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

interface PlayerJoinResponse {
    roomCode: string;
    player: TCheckersPlayer
}


export interface CheckersSocketResponse {
    [GAME_EVENT.CREATE_ROOM]: SocketResponse<PlayerJoinResponse>;
    [GAME_EVENT.JOIN_ROOM]: SocketResponse<PlayerJoinResponse>;
    [GAME_EVENT.RANDOM_ROOM]: SocketResponse<PlayerJoinResponse>;
    [GAME_EVENT.CAPTURE_PIECE]: SocketResponse<any>;
    [GAME_EVENT.MOVE_PIECE]: SocketResponse<any>;
    [GAME_EVENT.RESTART_GAME]: SocketResponse<any>;
    [GAME_EVENT.RESIGN_GAME]: SocketResponse<any>;
    [GAME_EVENT.UPDATE_GAME_RESULT]: SocketResponse<any>;
    [GAME_EVENT.UPDATE_GAME_STATE]: SocketResponse<any>;
    [GAME_EVENT.UPDATE_PLAYER_STATE]: SocketResponse<any>;
    [GAME_EVENT.UPDATE_ROOM_STATE]: SocketResponse<any>;
    [GAME_EVENT.RESET_GAME]: SocketResponse<any>;
    [GAME_EVENT.RESET_ROOM]: SocketResponse<any>;
    [GAME_EVENT.RESET_PLAYER]: SocketResponse<any>;
    [GAME_EVENT.CHAT]: SocketResponse<any>;
    [GAME_EVENT.ERROR]: SocketResponse<any>;
    [GAME_EVENT.ERROR_EVENT]: SocketResponse<any>;
}