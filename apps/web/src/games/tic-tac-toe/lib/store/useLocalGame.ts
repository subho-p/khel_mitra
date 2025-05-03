import { create } from "zustand";

import { TTicTacToeSymbol } from "../types";
import { checkWinningCombination } from "../utils";

interface State {
    board: TTicTacToeSymbol[];
    player: TTicTacToeSymbol;
    isGameOver: boolean;
    isDraw: boolean;
    winner: TTicTacToeSymbol | null;
    winningCombination: number[];
}

interface Actions {
    onClick: (index: number) => void;
    restartGame: () => void;
    reset: () => void;
}

const initialState: State = {
    board: Array(9).fill(null),
    player: "X",
    isGameOver: false,
    isDraw: false,
    winner: null,
    winningCombination: [],
};

export const useLocalGame = create<State & Actions>((set, get) => ({
    ...initialState,

    onClick: (index: number) => {
        const { board, player, isGameOver } = get();
        if (board[index] !== null || isGameOver) return;

        const newBoard = [...board];
        newBoard[index] = player;

        const newWinningCombination = checkWinningCombination(newBoard, player);

        if (newWinningCombination.length > 0) {
            set({
                board: newBoard,
                winningCombination: newWinningCombination,
                isGameOver: true,
                winner: player,
            });
        } else if (newBoard.every((cell) => cell !== null)) {
            set({
                board: newBoard,
                isGameOver: true,
                isDraw: true,
                winner: null,
            });
        } else {
            set({
                board: newBoard,
                player: player === "X" ? "O" : "X",
            });
        }
    },

    restartGame: () => {
        set({
            ...initialState,
            player: get().player,
        });
    },

    reset: () => {
        set({
            ...initialState,
        });
    },
}));
