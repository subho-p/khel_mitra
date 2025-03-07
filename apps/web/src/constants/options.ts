export const GamePlayerType = ["Online", "Local"] as const;
export type GamePlayerType = (typeof GamePlayerType)[number];

export const OnlinePlayerType = ["Friend", "Random"] as const;
export type OnlinePlayerType = (typeof OnlinePlayerType)[number];

export const RoomMemberType = ["Admin", "Player"] as const;
export type RoomMemberType = (typeof RoomMemberType)[number];
