import { TTicTacToeSymbol } from "./types";

export function checkWinningCombination(board: TTicTacToeSymbol[], currentSymbol: TTicTacToeSymbol) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === currentSymbol && board[b] === currentSymbol && board[c] === currentSymbol) {
            return combination;
        }
    }
    return [];
}
