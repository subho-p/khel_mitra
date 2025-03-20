"use client";

import { AnimatePresence } from "motion/react";
import { TicTacToeCell, TicTacToeSymbol } from "./_lib/types";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import React from "react";

const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
        const delay = 0 + i * 0.1;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay, duration: 0.01 },
            },
        };
    },
};

const Circle = () => {
    return (
        <motion.svg width="100%" height="100%" initial="hidden" animate="visible">
            <motion.circle
                cx="55"
                cy="55"
                r="35%"
                stroke="#ff0055"
                variants={draw}
                custom={1}
                strokeWidth={10}
                className="bg-transparent"
            />
        </motion.svg>
    );
};

const Cross = () => {
    return (
        <div className="w-full flex items-center justify-center">
            <motion.svg width="100%" height="100%" initial="hidden" animate="visible">
                <motion.line
                    x1="10%"
                    y1="10%"
                    x2="90%"
                    y2="66%"
                    stroke="#00cc88"
                    variants={draw}
                    custom={2}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
                <motion.line
                    x1="10%"
                    y1="66%"
                    x2="90%"
                    y2="10%"
                    stroke="#00cc88"
                    variants={draw}
                    custom={6}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </motion.svg>
        </div>
    );
};

export const TicTacToeBoard: React.FC<{
    board: TicTacToeCell[];
    handleClick: (index: number) => void;
    winningCombination?: number[];
}> = ({ board, handleClick, winningCombination }) => {
    return (
        <div className="w-full max-w-sm aspect-square relative">
            <div className="grid grid-cols-3 grid-rows-3 gap-[1px]">
                {board.map((cell, idx) => (
                    <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: idx * 10, y: idx * 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: idx * 0.2, damping: 300 }}
                        className={cn(
                            "aspect-square text-center text-2xl font-bold text-white border-2 rounded-md",
                            winningCombination?.includes(idx) && "bg-secondary",
                        )}
                        onClick={() => handleClick(idx)}
                    >
                        <AnimatePresence>
                            {cell !== null && (
                                <div className="relative p-2">
                                    {cell === "X" && <Cross />}
                                    {cell === "O" && <Circle />}
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
