"use client";

import React from "react";
import { MenuDropdown } from "@/tic-tac-toe/components";
import { LocalGame, TicTacToeBoard } from "@/tic-tac-toe/components";
import { useTicTacToeStore } from "@/tic-tac-toe/lib/useTicTacToeStore";

export const GamePage = () => {
    const { playerType } = useTicTacToeStore();

    return (
        <React.Fragment>
            <div className="flex w-full">
                <MenuDropdown />
            </div>
            {playerType == "Online" && (
                <div className="w-full items-center justify-center">
                    <TicTacToeBoard
                        board={[null, null, null, null, null, null, null, null, null]}
                        handleClick={() => {}}
                        winningCombination={[]}
                    />
                </div>
            )}
            {playerType == "Local" && <LocalGame />}
        </React.Fragment>
    );
};

