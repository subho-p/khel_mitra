import { TCheckersCell, TCheckersPiece } from '@khel-mitra/shared/types';
import { CHECKERS_BOARD_SIZE } from '../../../constants';
import { Logger } from '@nestjs/common';

export interface Moves {
    move: TCheckersCell;
    captures?: TCheckersCell[];
}

export const findPossibleCheckersMoves = (
    board: TCheckersCell[][],
    currentCell: TCheckersCell,
    currentPlayerId?: string,
    capturedCells: TCheckersCell[] = [],
    visitedCells: TCheckersCell[] = [],
): Moves[] => {
    const moves: Moves[] = [];

    const {
        position: [col, row],
        piece,
    } = currentCell;
    if (!piece || piece.playerId !== currentPlayerId) return moves;

    const directions = getPossiableDirectionsToGo(piece);

    for (const [dc, dr] of directions) {
        const nextCol = col + dc;
        const nextRow = row + dr;

        if (!isBounded(nextRow, nextCol)) continue;
        const nextCell = board[nextCol][nextRow];

        if (!nextCell.piece) {
            if (!visitedCells.includes(nextCell)) {
                moves.push({ move: nextCell });
            }
        } else if (nextCell.piece.playerId !== currentPlayerId) {
            const landingCol = nextCell.position[0] + dc;
            const landingRow = nextCell.position[1] + dr;

            if (!isBounded(landingRow, landingCol)) continue;
            const landingCell = board[landingCol][landingRow];
            if (!landingCell.piece && !capturedCells.includes(nextCell)) {
                moves.push({ move: landingCell, captures: [nextCell] });

                const furtherMoves = findPossibleCheckersMoves(
                    board,
                    { ...landingCell, piece: currentCell.piece },
                    currentPlayerId,
                    [...capturedCells, nextCell],
                    [...visitedCells, nextCell],
                );
                Logger.debug(
                    `Futher moves from ${currentCell.position.toString()} to ${landingCell.position.toLocaleString()}`,
                    'Future moves',
                );
                furtherMoves.forEach((furtherMove) => {
                    if (furtherMove.captures) {
                        moves.push({
                            move: furtherMove.move,
                            captures: [...furtherMove.captures, nextCell],
                        });
                    }
                });
            }
        }
    }

    return moves;
};

function getPossiableDirectionsToGo(piece: TCheckersPiece) {
    if (piece.isKing) {
        return [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ];
    }
    return piece.isForward
        ? [
              [1, 1],
              [-1, 1],
          ]
        : [
              [1, -1],
              [-1, -1],
          ];
}

function isBounded(row: number, col: number) {
    return row >= 0 && row < CHECKERS_BOARD_SIZE && col >= 0 && col < CHECKERS_BOARD_SIZE;
}
