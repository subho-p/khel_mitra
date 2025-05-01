import React, { useEffect } from "react";
import { motion } from "motion/react";
import { TicTacToeBoard } from "@/tic-tac-toe/components";
import { useLocalGame } from "@/tic-tac-toe/lib/useLocalGame";

export const LocalGame = () => {
    const {
        board,
        player,
        winner,
        isGameOver,
        isDraw,
        winningCombination,
        onClick,
        restartGame,
        reset,
    } = useLocalGame();

    useEffect(() => {
        reset();
    }, []);

    return (
        <React.Fragment>
            {isGameOver && (
                <div className="w-md absolute z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0, y: 20, translateY: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0, translateY: "100%" }}
                        transition={{ duration: 0.5 }}
                        className=" inset-0 w-full h-full text-white text-center font-bold text-4xl rounded-md bg-background/90 backdrop-blur-xs border py-4 px-2 space-y-4"
                    >
                        {winner && <p>{winner} wins!</p>}
                        {isDraw && <p>Draw!</p>}

                        <button
                            onClick={restartGame}
                            className="border py-2 px-4 cursor-pointer rounded-md border-primary/20 text-xl shadow-2xl shadow-primary/50"
                        >
                            Reset Game
                        </button>
                    </motion.div>
                </div>
            )}
            <div className="w-full max-w-sm items-center justify-center relative">
                <div className="pb-4">
                    <p className="mt-4 text-2xl font-semibold">Player : {player}</p>
                </div>
                <TicTacToeBoard
                    board={board}
                    handleClick={onClick}
                    winningCombination={winningCombination}
                />
            </div>
        </React.Fragment>
    );
};
