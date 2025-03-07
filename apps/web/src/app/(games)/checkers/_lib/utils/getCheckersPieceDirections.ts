import { TCheckersPiece } from "@khel-mitra/shared/types";

export function getCheckersPieceDirections(piece: TCheckersPiece) {
    return piece.isKing
        ? [
              [1, 1],
              [-1, 1],
              [1, -1],
              [-1, -1],
          ]
        : piece.isForward
          ? [
                [1, 1],
                [-1, 1],
            ]
          : [
                [1, -1],
                [-1, -1],
            ];
}