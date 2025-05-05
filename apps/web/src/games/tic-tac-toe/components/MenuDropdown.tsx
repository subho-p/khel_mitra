"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import React from "react";
import { useLocalGame } from "@/tic-tac-toe/lib/useLocalGame";
import { useTicTacToeStore } from "@/tic-tac-toe/lib/useTicTacToeStore";
import { useTicTacToeGameStore } from "@/tic-tac-toe/lib/useTicTiaToeGameStore";

export const MenuDropdown = () => {
    const onReset = () => {
        if (useTicTacToeStore.getState().playerType == "Local") {
            useLocalGame.getState().reset();
        }
    };

    const onExit = () => {
        useTicTacToeStore.getState().reset();
        useTicTacToeGameStore.getState().reset();
        useLocalGame.getState().reset();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Menu className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={6} align="end">
                <DropdownMenuItem onClick={onReset}>Reset</DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onExit}
                    className="text-destructive focus:text-destructive"
                >
                    Exit
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
