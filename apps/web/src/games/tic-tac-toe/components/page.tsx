"use client";

import { useEffect } from "react";
import { WaitingLayout, SelectOptions, GamePage } from "@/tic-tac-toe/components";
import { useTicTacToeStore } from "@/tic-tac-toe/lib/useTicTacToeStore";
import { useTicTacToeGameStore } from "@/tic-tac-toe/lib/useTicTiaToeGameStore";
import { useLocalGame } from "../lib/useLocalGame";

export const TicTacToePage = () => {
    const { reset, playerType, status, setStatus } = useTicTacToeStore();
    const { restartGame } = useLocalGame();

    const {} = useTicTacToeGameStore();

    const startGame = () => {
        if (playerType == "Local") {
            restartGame();
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
