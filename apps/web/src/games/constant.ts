export const GameParams = ["tic-tac-toe", "checkers", "rock-paper-scissors"] as const;

export const PlayerType = ["Local", "Online"] as const;
export const OnlinePlayerType = ["Friend", "Random"] as const;
export const RoomMemberType = ["Admin", "Player"] as const;
export const GameStatus = ["Idle", "Waiting", "Playing", "Finished"] as const;

export type PlayerType = (typeof PlayerType)[number];
export type OnlinePlayerType = (typeof OnlinePlayerType)[number];
export type RoomMemberType = (typeof RoomMemberType)[number];
export type GameStatus = (typeof GameStatus)[number];
