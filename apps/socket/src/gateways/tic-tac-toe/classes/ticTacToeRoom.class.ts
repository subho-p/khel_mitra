import { GameStatus } from '@khel-mitra/shared/types';
import { TicTacToeCell, TicTacToeSymbol, TTicTacToeRoom } from '../types';
import { TicTacToePlayer } from './ticTacToePlayer.class';

export class TicTacToeRoom implements TTicTacToeRoom {
    id: string;
    players: TicTacToePlayer[];
    board: Array<TicTacToeCell>;
    currentPlayer?: TicTacToePlayer;
    winnerId?: string;
    createdAt: number;
    updatedAt: number;
    maxSkip: number;
    isRandomRoom: boolean;
    status: GameStatus;

    constructor(id: string) {
        this.id = id;
        this.players = [];
        this.maxSkip = 0;
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
        this.isRandomRoom = false;
        this.board = Array(9).fill(null);
        this.status = 'idle';
    }

    get roomId(): string {
        return this.id;
    }

    addPlayer(player: TicTacToePlayer): void {
        if (this.players.length === 2) {
            throw new Error('Room is full');
        } else {
            this.status = 'pending';
            this.players.push(player);
        }
    }

    insertPiece(position: number, symbol: TicTacToeSymbol) {
        if (this.board[position] || this.status === 'finished') {
            return;
        }
        this.board[position] = symbol;
        this.switchCurrentPlayer();
        this.updatedAt = Date.now();
    }

    resetPlayersStatus() {
        this.players.forEach((player) => {
            player.isReady = false;
        });
    }

    switchCurrentPlayer() {
        this.currentPlayer =
            this.currentPlayer?.id === this.players[0].id ? this.players[1] : this.players[0];
    }

    checkWin(): {
        winnerId: string;
        winningCombination: number[];
    } | null {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // Rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // Columns
            [0, 4, 8],
            [2, 4, 6], // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;

            if (
                this.board[a] !== null &&
                this.board[a] === this.board[b] &&
                this.board[b] === this.board[c]
            ) {
                const winner = this.players.find((player) => player.symbol === this.board[a])!;
                return {
                    winnerId: winner?.id,
                    winningCombination: combination,
                };
            }
        }

        return null;
    }

    get isDraw() {
        return this.board.every((cell) => cell !== null);
    }

    get serializeData() {
        return {
            id: this.id,
            players: this.players.map((player) => player.serialize()),
            board: this.board,
            currentPlayerId: this.currentPlayer?.id,
            winnerId: this.winnerId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
