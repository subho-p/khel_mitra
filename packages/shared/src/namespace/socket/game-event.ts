export const GAME_EVENT = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",

    CREATE_ROOM: "game_create_room",
    JOIN_ROOM: "game_join_room",
    RANDOM_ROOM: "game_random_room",

    PLAYER_READY: "player_ready",
    PLAYER_LEAVE: "player_leave",

    INIT_ROOM: "init_room",
    START_GAME: "game_start_game",
    MOVE_PIECE: "game_move_piece",
    CAPTURE_PIECE: "game_capture_piece",
    RESIGN_GAME: "game_resign_game",
    RESTART_GAME: "game_restart_game",

    UPDATE_GAME_STATE: "game_update_game_state",
    UPDATE_ROOM_STATE: "game_update_room_state",
    UPDATE_PLAYER_STATE: "game_update_player_state",
    UPDATE_GAME_RESULT: "game_update_game_result",

    GAME_OVER: "game_over",
    RESET_GAME: "game_reset_game",
    RESET_ROOM: "game_reset_room",
    RESET_PLAYER: "game_reset_player",

    CHAT: "game_chat",
    ERROR: "game_error",
    ERROR_EVENT: "game_error_event",

    GAME_STATUS: "game_status",
} as const;

export type GAME_EVENT = typeof GAME_EVENT[keyof typeof GAME_EVENT];

