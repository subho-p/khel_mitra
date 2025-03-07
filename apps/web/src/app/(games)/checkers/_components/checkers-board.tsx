import { DisplayMap } from "@/components/common";
import { CheckersRow } from "@/checkers/_components";
import { TCheckersBoard, TCheckersCell } from "@khel-mitra/shared/types";

export const CheckersBoard: React.FC<{
    board?: TCheckersBoard;
    clickCell: (cell: TCheckersCell) => void;
    currentSelectCell?: TCheckersCell;
}> = ({ board, clickCell, currentSelectCell }) => {
    if (!board) return null;

    return (
        <div className="flex md:h-full w-full md:w-auto aspect-square ring-4 ring-neutral-600">
            <DisplayMap
                data={board}
                className="w-full grid grid-cols-8"
                renderItem={(row, rowIdx) => (
                    <CheckersRow
                        key={rowIdx}
                        row={row}
                        clickCell={clickCell}
                        currentSelectCell={currentSelectCell}
                    />
                )}
            />
        </div>
    );
};
