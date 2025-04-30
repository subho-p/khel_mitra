"use client";

import { motion } from "motion/react";
import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTicTacToeStore } from "@/tic-tac-toe/lib/useTicTacToeStore";
import { useTicTacToeGameStore } from "@/tic-tac-toe/lib/useTicTiaToeGameStore";

export const WaitingLayout = () => {
    const [countdown, setCountdown] = useState(0);
    const { reset } = useTicTacToeStore();
    const { reset: resetGame } = useTicTacToeGameStore();

    const resetAndCancel = useCallback(() => {
        setCountdown(0);
        reset();
        resetGame();
    }, [reset, resetGame]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (countdown >= 15) {
                resetAndCancel();
                clearInterval(interval);
                return;
            }
            setCountdown((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [countdown, resetAndCancel]);

    return (
        <motion.div
            className="w-full max-w-xl px-4 flex flex-col items-center justify-center gap-4"
        >
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">{countdown} seconds</p>
            <h4 className="text-2xl font-semibold">Waiting for others players to join...</h4>
            <Button variant="secondary" onClick={resetAndCancel}>
                <X className="pr-1 size-4" /> Cancel
            </Button>
        </motion.div>
    );
};
