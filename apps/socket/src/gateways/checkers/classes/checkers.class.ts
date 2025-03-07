import { GameStatus, TCheckers, TCheckersPieceColor } from '@khel-mitra/shared/types';
import { v4 as uuid } from 'uuid';
import { CheckersPlayer } from './checkers-player.class';
import { CheckersCell } from './checkers-cell.class';
import { CheckersPiece } from './checkers-piece.class';
import { CHECKERS_BOARD_SIZE } from '../../../constants';
import { TCheckersPiecesMoveSchema } from '../schemas';
import { findPossibleCheckersMoves } from '../utils';
import { Logger } from '@nestjs/common';

// const MAX_TIME_LIMIT = 60 * 5 * 1000;

export class CheckersGame implements TCheckers {
    readonly id: string;
    code: string;
    status: GameStatus;
    players: CheckersPlayer[];
    currentPlayerId?: string;
    board: CheckersCell[][];
    isGameOver: boolean;
    winnerId?: string;
    isRandomRoom: boolean;
    // #timeStamp: number;
    // #maxSkip: number;

    private readonly logger: Logger;

    readonly boardSize = CHECKERS_BOARD_SIZE;

    constructor(isRandomRoom: boolean = false) {
        this.id = uuid();
        this.code = this.id.substring(0, 6);
        this.status = 'idle';
        this.players = [];
        this.currentPlayerId = undefined;
        this.board = [];
        this.isGameOver = false;
        this.winnerId = undefined;
        this.isRandomRoom = isRandomRoom;
        // this.#timeStamp = Date.now();
        // this.#maxSkip = 2;

        this.logger = new Logger('CheckersGame');
    }

    checkTimeStamp() {
        // const currentTime = Date.now();
        // if (currentTime - this.#timeStamp > MAX_TIME_LIMIT) {
        //     this.endGame();
        // }
        // this.#timeStamp = currentTime;
        // this.#maxSkip--;
        // if (this.#maxSkip < 0) {
        //     this.endGame();
        // }
    }

    setStatus(status: GameStatus) {
        this.status = status;
    }

    setInitialStateBoard() {
        for (let row = 0; row < this.boardSize; row++) {
            const checkersRow: CheckersCell[] = [];
            for (let col = 0; col < this.boardSize; col++) {
                checkersRow.push(new CheckersCell([row, col], (col + row) % 2 === 1));
            }

            this.board.push(checkersRow);
        }
    }

    initializePieces() {
        const half = this.boardSize / 2;
        let pieceNumber = 1;

        const player1 = this.players[0];
        console.log('Player1 color :', player1.color);
        for (let row = 0; row < half - 1; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[col][row].isValid) {
                    this.board[col][row].piece = new CheckersPiece(
                        pieceNumber++,
                        player1.id,
                        player1.color,
                        true,
                    );
                }
            }
        }

        pieceNumber--;
        const player2 = this.players[1];
        console.log('Player2 color :', player2.color);
        for (let row = half + 1; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[col][row].isValid) {
                    this.board[col][row].piece = new CheckersPiece(
                        pieceNumber--,
                        player2.id,
                        player2.color,
                    );
                }
            }
        }
    }

    setPlayerColor() {
        const randomNumber = Math.floor(Math.random() * this.players.length);
        if (randomNumber === 0) {
            this.players[0].setColor('ORANGE');
            this.players[1].setColor('BLACK');
        } else {
            this.players[0].setColor('BLACK');
            this.players[1].setColor('ORANGE');
        }
    }

    // check player present in this room then return player
    getPlayerBySocketId(id: string): CheckersPlayer {
        const player = this.players.find((player) => player.socketId === id);
        if (!player) {
            throw new Error('Player not found in this room');
        }
        return player;
    }

    // is current player
    isCurrentPlayer(playerId: string): boolean {
        return this.currentPlayerId === playerId;
    }

    movePiece(data: TCheckersPiecesMoveSchema['move']) {
        this.checkTimeStamp();

        const { from, to } = data;
        const [fromRow, fromCol] = from;
        const [toRow, toCol] = to;
        const fromCell = this.board[fromRow][fromCol];
        const toCell = this.board[toRow][toCol];
        const moves = findPossibleCheckersMoves([...this.board], fromCell, this.currentPlayerId);
        Logger.debug(
            `Player ${this.currentPlayerId} moved piece from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}]`,
            'Checkers Move',
        );

        moves.forEach(
            ({
                move: {
                    position: [col, row],
                },
            }) => {
                Logger.debug(`Captured piece at [${col}, ${row}]`, 'Checkers possiable Move');
            },
        );

        if (moves.length === 0) {
            throw new Error('No valid moves found');
        }

        const validMove = moves.find(({ move }) => move === toCell);
        if (!validMove) {
            throw new Error('Invalid move');
        }

        const currentPiece = fromCell.piece!;
        fromCell.clearPiece();
        toCell.setPiece(currentPiece);
        validMove.captures?.forEach(({ position: [col, row] }) => {
            this.board[col][row].clearPiece();
        });

        this.switchCurrentPlayer();
    }

    noOfPieces(color: TCheckersPieceColor): number {
        const noOfPieces = this.board.reduce((count, row) => {
            const noOfPiecesInARow = row.reduce((rowCount, cell) => {
                if (cell.piece && cell.piece.color === color) {
                    return rowCount + 1;
                }
                return rowCount;
            }, 0);

            return count + noOfPiecesInARow;
        }, 0);

        return noOfPieces;
    }

    checkGameOver(): boolean {
        const player1Pieces = this.noOfPieces(this.players[0].color);
        const player2Pieces = this.noOfPieces(this.players[1].color);

        this.logger.log(
            `Player 1 pieces: ${player1Pieces}, Player 2 pieces: ${player2Pieces}`,
            'Checkers Game Over',
        );
        if (player1Pieces === 0 || player2Pieces === 0) {
            this.endGame();
            this.logger.verbose(`Game over, Player ${this.winnerId} wins`, 'Checkers Game Over');
            return true;
        }
        return false;
    }

    endGame() {
        this.status = 'finished';
        this.isGameOver = true;
        this.winnerId = this.currentPlayerId;
        this.currentPlayerId = undefined;
        this.players.map((player) => {
            player.isReady = false;
        });
    }

    reset(){
        this.status = 'idle';
        this.isGameOver = false;
        this.winnerId = undefined;
        this.currentPlayerId = undefined;
        this.players.map((player) => {
            player.isReady = false;
        });
        this.board.forEach((row) => row.forEach((cell) => cell.clearPiece()));
    }

    // switch current player
    switchCurrentPlayer() {
        this.currentPlayerId =
            this.currentPlayerId === this.players[0].id ? this.players[1].id : this.players[0].id;
        // broadcast current player id to all players
    }

    private updateGameStatus() {}
}
