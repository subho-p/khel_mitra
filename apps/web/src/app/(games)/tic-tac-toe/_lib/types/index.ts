import { SocketResponse } from "@/types";
import { GameStatus } from "@khel-mitra/shared/types";

export type TicTacToeSymbol = "X" | "O";
export type TicTacToeCell = TicTacToeSymbol | null;

export type TTicTacToePlayer = {
    id: string;
    username: string;
    symbol: TicTacToeSymbol;
    noOfWinings: number;
    avatarUrl?: string;
    isAdmin?: boolean;
    isReady?: boolean;
};

export type TTicTacToeRoom = {
    id: string;
    players: TTicTacToePlayer[];
    board: Array<TicTacToeCell>;
    currentPlayerId?: string;
    winnerId?: string;
    createdAt: number;
    updatedAt: number;
    maxSkip: number;
    isRandomRoom: boolean;
    status: GameStatus;
};

export type TTicTacToeMove = {
    playerId: string;
    cellIndex: number;
};

export type TTicTacToeSkipMove = {
    playerId: string;
};

// responses
export type TTicTacToeGameInitResponse = SocketResponse<{
    room: TTicTacToeRoom;
    player: TTicTacToePlayer;
}>;
