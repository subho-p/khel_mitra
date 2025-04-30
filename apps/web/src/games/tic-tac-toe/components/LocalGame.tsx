import React from "react";
import { motion } from "motion/react";
import { TTicTacToeSymbol } from "@/tic-tac-toe/lib/types";
import { TicTacToeBoard } from "@/tic-tac-toe/components";

export const LocalGame = () => {
    const [board, setBoard] = React.useState<TTicTacToeSymbol[]>(Array(9).fill(null));
    const [winningCombination, setWinningCombination] = React.useState<number[]>([]);
    const [player, setPlayer] = React.useState<TTicTacToeSymbol>("X");
    const [gameOver, setGameOver] = React.useState(false);
    const [winner, setWinner] = React.useState<TTicTacToeSymbol | null>(null);

    const handleClick = (index: number) => {
        if (board[index] !== null || gameOver) return;

        const newBoard = [...board];
        newBoard[index] = player;

        const newWinningCombination = checkWinningCombination(newBoard, player);

        if (newWinningCombination.length > 0) {
            setBoard(newBoard);
            setWinningCombination(newWinningCombination);
            setGameOver(true);
            setWinner(player);
        } else if (newBoard.every((cell) => cell !== null)) {
            setBoard(newBoard);
            setGameOver(true);
            setWinner(null); // draw
        } else {
            setBoard(newBoard);
            setPlayer(player === "X" ? "O" : "X");
        }
    };

    const checkWinningCombination = (
        board: TTicTacToeSymbol[],
        player: TTicTacToeSymbol,
    ): number[] => {
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
            if (board[a] === player && board[b] === player && board[c] === player) {
                return combination;
            }
        }
        return [];
    };

    const resetGame = () => {
        const currentBoard = [...board];

        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === null) continue;
            setTimeout(() => {
                currentBoard[i] = null;
                setBoard([...currentBoard]);
            }, i * 1000);
        }

        setWinningCombination([]);
        setPlayer("X");
        setGameOver(false);
        setWinner(null);
    };

    return (
        <React.Fragment>
            {gameOver && (
                <div className="w-md absolute z-50">
                    {winner && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0, y: 20, translateY: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0, translateY: "100%" }}
                            transition={{ duration: 0.5 }}
                            className=" inset-0 w-full h-full text-white text-center font-bold text-4xl rounded-md bg-background/90 backdrop-blur-xs border py-4 px-2 space-y-4"
                        >
                            <p>{winner} wins!</p>

                            <button
                                onClick={resetGame}
                                className="border py-2 px-4 cursor-pointer rounded-md border-primary/20 text-xl shadow-2xl shadow-primary/50"
                            >
                                Reset Game
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
            <div className="w-full max-w-sm items-center justify-center relative">
                <TicTacToeBoard
                    board={board}
                    handleClick={handleClick}
                    winningCombination={winningCombination}
                />
            </div>
        </React.Fragment>
    );
};
