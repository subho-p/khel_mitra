import { GameStatus } from "../../constant";

export type TTicTacToeSymbol = "X" | "O" | null;
export type TTicTacToeCell = TTicTacToeSymbol | null;

export type TTicTacToeBoard = TTicTacToeCell[];

export type TTicTacToePlayer = {
    id: number;
    symbol: TTicTacToeSymbol;
    username: string;
    avatarUrl?: string;
    isReady?: boolean;
    noOfWinings?: number;
    isAdmin?: boolean;
    noOfSkip?: number;
};

export type TTicTacToeRoom = {
    id: string;
    players: TTicTacToePlayer[];
    board: TTicTacToeBoard;
    currentPlayer?: TTicTacToePlayer | null;
    winnerId?: string | null;
    status: GameStatus;
};