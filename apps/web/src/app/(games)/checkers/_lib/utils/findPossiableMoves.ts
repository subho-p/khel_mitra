import { TCheckersCell } from "@khel-mitra/shared/types";
import { getCheckersPieceDirections } from "./getCheckersPieceDirections";
import { isBounded } from "./isBounded";

export interface Move {
    move: TCheckersCell;
    captures?: TCheckersCell[];
}

export function findPossibleMoves(
    board: TCheckersCell[][],
    currentCell: TCheckersCell,
    currentPlayerId?: string,
    capturedCells: TCheckersCell[] = [],
    visitedCells: TCheckersCell[] = [],
) {
    const moves: Move[] = [];

    const {
        position: [col, row],
        piece,
    } = currentCell;

    if (!piece || piece?.playerId !== currentPlayerId) return [];

    const directions = getCheckersPieceDirections(piece);

    for (const direction of directions) {
        const newCol = col + direction[0];
        const newRow = row + direction[1];

        if (!isBounded(newRow, newCol)) continue;
        const theCell = board[newCol][newRow];

        if (!theCell.piece) {
            if (!visitedCells.includes(theCell)) {
                moves.push({ move: theCell });
            }
        } else if (theCell.piece.playerId !== currentPlayerId) {
            const jumpCol = theCell.position[0] + direction[0];
            const jumpRow = theCell.position[1] + direction[1];

            if (!isBounded(jumpRow, jumpCol)) continue;
            const landingCell = board[jumpCol][jumpRow];
            if (!landingCell.piece && !capturedCells.includes(theCell)) {
                moves.push({
                    move: landingCell,
                    captures: [theCell],
                });

                const furtherMoves = findPossibleMoves(
                    board,
                    { ...landingCell, piece: currentCell.piece },
                    currentPlayerId,
                    [...capturedCells, theCell],
                    [...visitedCells, theCell],
                );

                furtherMoves.forEach((furtherMove) => {
                    console.log(furtherMove)
                    if (furtherMove.captures) {
                        moves.push(furtherMove);
                    }
                });
            }
        }
    }

    return moves;
}
