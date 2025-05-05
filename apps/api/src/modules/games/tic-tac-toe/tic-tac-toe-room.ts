import { GameRoom } from '../classes/game-room.class';
import { GameInit } from '../schemas';
import { WsException } from '@nestjs/websockets';
import { TicTacToePlayer } from './tic-tac-toe-player';
import { TicTacToeCell } from './types';

export class TicTacToeRoom extends GameRoom {
    players: TicTacToePlayer[];
    board: TicTacToeCell[];
    currentPlayer: TicTacToePlayer | null;
    winnerId: string | null;

    constructor(isRandomRoom: boolean = false) {
        super('TicTacToe', isRandomRoom);

        this.players = [];
        this.board = Array(9).fill(null);
        this.currentPlayer = null;
        this.winnerId = null;
    }

    initGame(data: GameInit) {
        this.initBoard();
        this.isRandomRoom = data.isRandom;
    }

    addPlayer(player: TicTacToePlayer) {
        if (this.players.length >= this.maxPlayers) {
            throw new WsException('Room is full');
        }
        this.players.push(player);
    }

    private initBoard() {
        this.board = Array(9).fill(null);
    }

    startGame(): void {}

    endGame(): void {}

    makeMove(): void {}

    leaveGame(): void {}

    joinGame(): void {}

    deleteGame(): void {}

    getRoom(): void {}

    deleteRoom(): void {}

    serializeData() {
        return {
            id: this.id,
            players: this.players.map((player) => player.serializeData()),
            board: this.board,
            status: this.status,
            currentPlayer: this.currentPlayer,
            winnerId: this.winnerId,
            maxSkip: this.maxSkip,
        };
    }
}
