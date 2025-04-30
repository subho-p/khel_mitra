"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import React from "react";
import { LocalGame, TicTacToeBoard } from "@/tic-tac-toe/components";
import { useTicTacToeStore } from "@/tic-tac-toe/lib/useTicTacToeStore";
import { useTicTacToeGameStore } from "@/tic-tac-toe/lib/useTicTiaToeGameStore";

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

const MenuDropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Menu className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={6} className="ml-24">
                <DropdownMenuItem
                    onClick={() => {
                        useTicTacToeStore.getState().reset();
                        useTicTacToeGameStore.getState().reset();
                    }}
                >
                    Exit
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
