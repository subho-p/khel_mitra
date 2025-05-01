"use client";

import { useEffect } from "react";
import { WaitingLayout, SelectOptions, GamePage } from "@/tic-tac-toe/components";
import { useTicTacToeStore } from "@/tic-tac-toe/lib/useTicTacToeStore";
import { useTicTacToeGameStore } from "@/tic-tac-toe/lib/useTicTiaToeGameStore";

export const TicTacToePage = () => {
    const { reset, playerType } = useTicTacToeStore();

    const { status, setStatus } = useTicTacToeGameStore();

    const startGame = () => {
        if (playerType == "Local") {
            setStatus("Playing");
            return;
        }
        setStatus("Waiting");

        setTimeout(() => {
            setStatus("Playing");
        }, 5_000);
    };

    useEffect(() => {
        return () => reset();
    }, []);

    if (status == "Playing") {
        return <GamePage />;
    }

    if (status == "Idle") {
        return <SelectOptions startGame={startGame} />;
    }

    if (status == "Waiting") {
        return <WaitingLayout />;
    }

    return <SelectOptions startGame={startGame} />;
};
