"use client";

import React from "react";
import { useGameOptions } from "@/providers";

import { LocalTicTacToe } from "./LocalTicTacToe";
import { OnlineTicTacToe } from "./OnlineTicTacToe";
import { OnlineTicTacToeProvider } from "./OnlineTicTacToeProvider";

export default function TicTacToePage() {
    const gameOptions = useGameOptions();

    if (gameOptions.playerType === "Local") {
        return <LocalTicTacToe />;
    }

    if (gameOptions.playerType === "Online") {
        return (
            <OnlineTicTacToeProvider>
                <OnlineTicTacToe />
            </OnlineTicTacToeProvider>
        );
    }

    return <div>Please select a game mode. Something went wrong</div>;
}
