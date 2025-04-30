import { GameStatus } from "../../constant";

export type TTicTacToeSymbol = "X" | "O" | null;
export type TTicTacToeCell = TTicTacToeSymbol | null;

export type TTicTacToeBoard = TTicTacToeCell[];

export type TTicTacToePlayer = {
    symbol: TTicTacToeSymbol;
    name: string;
    avatarUrl?: string;
    isReady?: boolean;
    noOfWinings?: number;
    isAdmin?: boolean;
};

export type TTicTacToeRoom = {
    id: string;
    players: TTicTacToePlayer[];
    board: TTicTacToeBoard;
    currentPlayer?: TTicTacToePlayer;
    winnerId?: string;
    createdAt: number;
    updatedAt: number;
    maxSkip: number;
    isRandomRoom: boolean;
    status: GameStatus;
};