"use client";

import { motion } from "motion/react";
import { draw } from "@/tic-tac-toe/lib/variants";

export const Cross = () => {
    return (
        <div className="w-full flex items-center justify-center">
            <motion.svg width="100%" height="100%" initial="hidden" animate="visible" exit="exit">
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
