'use client';

import { cn } from "@/lib/utils";
import { TTicTacToeCell } from "@/tic-tac-toe/lib/types";
import { AnimatePresence, motion } from "motion/react";
import { Cross, Circle } from "@/tic-tac-toe/components";

export const TicTacToeBoard: React.FC<{
    board: TTicTacToeCell[];
    handleClick: (index: number) => void;
    winningCombination?: number[];
}> = ({ board, handleClick, winningCombination }) => {
    return (
        <div className="w-full max-w-sm aspect-square relative">
            <div className="w-full grid grid-cols-3 grid-rows-3 gap-[1px]">
                {board.map((cell, idx) => (
                    <motion.button
                        key={idx}
                        initial={{
                            opacity: 0,
                            x: idx * 20,
                            y: idx * 20,
                        }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            duration: 0.5,
                            delay: idx * 0.2,
                            damping: 300,
                        }}
                        className={cn(
                            "w-[8rem] h-[8rem] text-center text-2xl font-bold text-white border-2 rounded-md shadow-md shadow-primary/20 hover:shadow-primary/40 hover:shadow-lg cursor-pointer",
                            winningCombination?.includes(idx) && "bg-secondary",
                        )}
                        onClick={() => handleClick(idx)}
                    >
                        <div className="relative p-2">
                            <AnimatePresence>{cell === "X" && <Cross />}</AnimatePresence>
                            <AnimatePresence>{cell === "O" && <Circle />}</AnimatePresence>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
