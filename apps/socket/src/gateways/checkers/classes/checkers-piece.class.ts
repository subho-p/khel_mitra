import { TCheckersPiece, TCheckersPieceColor } from '@khel-mitra/shared/types';

export class CheckersPiece implements TCheckersPiece {
    id: string;
    playerId: string;
    color: TCheckersPieceColor;
    isKing: boolean = false;
    isCaptured: boolean = false;
    isForward: boolean;

    constructor(
        id: number,
        playerId: string,
        color: TCheckersPieceColor,
        isForward: boolean = false,
    ) {
        this.id = `${color}-${id}`;
        this.playerId = playerId;
        this.color = color;
        this.isForward = isForward;
    }

    move(toPosition: [number, number]) {}

    private calculateKing() {}

    capture(capturedPiece: CheckersPiece) {
        this.isCaptured = true;
        capturedPiece.isCaptured = false;
    }

    getPossiableDirectionsToGo() {
        if (this.isKing) {
            return [
                [1, 1],
                [-1, 1],
                [1, -1],
                [-1, -1],
            ];
        }
        return this.isForward
            ? [
                  [1, 1],
                  [-1, 1],
              ]
            : [
                  [1, -1],
                  [-1, -1],
              ];
    }
}
