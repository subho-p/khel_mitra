import { TCheckersCell, TCheckersPiece } from '@khel-mitra/shared/types';
import { CheckersPiece } from './checkers-piece.class';
import { CHECKERS_BOARD_SIZE } from '../../../constants';

export class CheckersCell implements TCheckersCell {
    position: [row: number, col: number];
    piece?: CheckersPiece;
    isAvailable: boolean = true;
    isValid: boolean = false;

    constructor(position: [row: number, col: number], isValid: boolean = false) {
        this.position = position;
        this.piece = undefined;
        this.isValid = isValid;
    }

    clearPiece() {
        this.piece = undefined;
        this.isAvailable = true;
    }

    setPiece(piece: TCheckersPiece) {
        const id = parseInt(piece.id.split('-')[1], 10);
        this.piece = new CheckersPiece(id, piece.playerId, piece.color, piece.isForward);

        if (piece.isKing) {
            this.piece.isKing = true;
        } else {
            if (piece.isForward && this.position[1] === CHECKERS_BOARD_SIZE - 1) {
                this.piece.isKing = true;
            } else if (this.position[1] === 0) {
                this.piece.isKing = true;
            }
        }
    }

    isOccupied(): boolean {
        return this.piece !== undefined;
    }

    getPiece(): CheckersPiece | undefined {
        return this.piece;
    }

    moveTo(newPosition: [row: number, col: number]) {
        this.position = newPosition;
    }

    isSamePosition(other: CheckersCell): boolean {
        return this.position[0] === other.position[0] && this.position[1] === other.position[1];
    }

    isAdjacent(other: CheckersCell): boolean {
        const [rowDiff, colDiff] = [
            this.position[0] - other.position[0],
            this.position[1] - other.position[1],
        ];
        return Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1;
    }

    isDiagonal(other: CheckersCell): boolean {
        const [rowDiff, colDiff] = [
            this.position[0] - other.position[0],
            this.position[1] - other.position[1],
        ];
        return Math.abs(rowDiff) === Math.abs(colDiff);
    }

    getDistance(other: CheckersCell): number {
        const isDiagonal = this.isDiagonal(other);
        const [rowDiff, colDiff] = [
            this.position[0] - other.position[0],
            this.position[1] - other.position[1],
        ];

        if (isDiagonal) {
            return Math.sqrt(Math.pow(rowDiff, 2) + Math.pow(colDiff, 2));
        } else {
            return Math.abs(rowDiff) + Math.abs(colDiff);
        }
    }

    canMove(other: CheckersCell, isCapture: boolean = false): boolean {
        if (!this.isOccupied()) {
            return false;
        }

        const isSameColor = this.piece?.color === other.piece?.color;
        const isDiagonalMove = this.isDiagonal(other);
        const isCaptureMove = isCapture && this.piece?.color !== other.piece?.color;

        if (isSameColor) {
            return false;
        }

        if (isDiagonalMove && (isCaptureMove || isCapture)) {
            const distance = this.getDistance(other);
            return distance === 1;
        } else if (!isDiagonalMove) {
            return false;
        }

        return true;
    }
}
