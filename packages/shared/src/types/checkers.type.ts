import { GameStatus } from "./game.type";
import { TPlayer } from "./player.type";

export type TCheckersPieceColor = "ORANGE" | "BLACK"

export type TCheckersPlayer = TPlayer & {
    color: TCheckersPieceColor
    isAdmin?: boolean;
    isReady?: boolean;
};

export type TCheckersPiece = {
    id: string;
    playerId: string;
    color: TCheckersPieceColor;
    isKing: boolean;
    isCaptured: boolean;
    isForward: boolean;
};

export type TCheckersCell = {
    position: [row: number, col: number];
    piece?: TCheckersPiece;
    isHighlighted?: boolean;
    isAvailable: boolean;
    isValid: boolean;
};

export type TCheckersBoard = TCheckersCell[][];

export type TCheckers = {
    readonly id: string;
    code: string;
    status: GameStatus;
    players: TCheckersPlayer[];
    currentPlayerId?: string;
    board: TCheckersBoard;
    isGameOver: boolean;
    winnerId?: string;
};
