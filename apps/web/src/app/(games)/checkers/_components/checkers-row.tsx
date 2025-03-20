import { DisplayMap } from "@/components/common";
import { VariantProps } from "class-variance-authority";
import { TCheckersCell } from "@khel-mitra/shared/types";
import { CheckersCell, checkersCellVariants, CheckersPiece } from "@/components/games";

export const CheckersRow: React.FC<{
    row: TCheckersCell[];
    clickCell: (cell: TCheckersCell) => void;
    currentSelectCell?: TCheckersCell;
}> = ({ row, clickCell, currentSelectCell }) => {
    const checkersCellVariant = (
        cell: TCheckersCell,
    ): VariantProps<typeof checkersCellVariants>["variant"] => {
        if (!cell.isValid) return "unavailable";

        if (currentSelectCell?.position === cell.position) {
            console.log("currentSelectCell");
            return "highlighted";
        }

        if (cell.isHighlighted) {
            console.log("Highlight");
            return "green";
        }

        return "default";
    };

    return (
        <DisplayMap
            data={row}
            className="grid grid-cols-1 bg-amber-70"
            renderItem={(cell, cellIdx) => (
                <CheckersCell
                    key={cellIdx}
                    variant={checkersCellVariant(cell)}
                    onClick={() => clickCell(cell)}
                >
                    {cell.piece && (
                        <CheckersPiece variant={cell.piece.color === "BLACK" ? "black" : "orange"}>
                            {cell.piece.isKing && (
                                <span className="text-white text-2xl">&#9818;</span>
                            )}
                        </CheckersPiece>
                    )}
                </CheckersCell>
            )}
        />
    );
};
