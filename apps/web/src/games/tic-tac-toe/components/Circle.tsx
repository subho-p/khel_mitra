"use client";

import { motion } from "motion/react";
import { draw } from "@/tic-tac-toe/lib/variants";

export const Circle = () => {
    return (
        <motion.svg width="100%" height="100%" initial="hidden" animate="visible" exit="exit">
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
