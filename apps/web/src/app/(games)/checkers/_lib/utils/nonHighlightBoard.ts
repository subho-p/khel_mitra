import { TCheckersCell } from "@khel-mitra/shared/types";

export function nonHighlightedBoard(board: TCheckersCell[][]): TCheckersCell[][] {
    return [...board].map((row) => row.map((cell) => ({ ...cell, isHighlighted: false })));
}
