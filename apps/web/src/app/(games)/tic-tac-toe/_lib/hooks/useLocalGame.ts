import { useState } from "react";
import { TicTacToeCell, TicTacToeSymbol } from "../types"
import { BoardSize } from "../constant";

export const useLocalGame = () => {
    const [currentPlayer, setCurrentPlayer] = useState<TicTacToeSymbol>("X");
    const [board, setBoard] = useState<TicTacToeCell[]>(Array(BoardSize).fill(null));

    const [winner, setWinner] = useState<TicTacToeSymbol>();
    const [winningCombination, setWinnerCombination] = useState<number[]>([]);

    const handleClick = (index: number) => {
        if (board[index] !== null || winner) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        setBoard(newBoard);
        setTimeout(() => {
            const winningResult = checkWin(newBoard);
            if (winningResult) {
                setWinner(winningResult.winner);
                setWinnerCombination(winningResult.winningCombination);
            }
        }, 1000);
    };

    const checkWin = (
        board: TicTacToeCell[],
    ):
        | {
              winner: TicTacToeSymbol;
              winningCombination: number[];
          }
        | undefined => {
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
            if (
                combination.every((i) => board[i] === board[combination[0]]) &&
                board[combination[0]] !== null
            ) {
                return {
                    winner: board[combination[0]] as TicTacToeSymbol,
                    winningCombination: combination,
                };
            }
        }
    };

    const resetGame = () => {
        setBoard(Array(BoardSize).fill(null));
        setWinnerCombination([]);
        setWinner(undefined);
    };

    return {
        currentPlayer,
        board,
        winner,
        winningCombination,
        handleClick,
        resetGame,
    };
};
