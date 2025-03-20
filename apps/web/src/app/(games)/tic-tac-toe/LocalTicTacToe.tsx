"use client";

import { Button } from "@/components/ui/button";
import { TicTacToeBoard } from "./TicTacToeBoard";
import * as motion from "motion/react-client";
import { useLocalGame } from "./_lib/hooks/useLocalGame";


export const LocalTicTacToe = () => {
    const { board, handleClick, winner, winningCombination, resetGame } = useLocalGame();

    return (
        <div className="container flex items-center justify-center relative">
            <TicTacToeBoard
                board={board}
                handleClick={handleClick}
                winningCombination={winningCombination}
            />
            <div className="w-full m-2 max-w-md absolute">
                {winner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inset-0 w-full h-full text-white text-center font-bold text-4xl rounded-md bg-background/80 border py-4 px-2 space-y-4"
                    >
                        <p>{winner} wins!</p>

                        <Button onClick={resetGame}>Reset Game</Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
