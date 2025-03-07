"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useOnlineCheckers } from "@/checkers/_lib/hooks";

import { CheckersPiece } from "@/components/games";
import { CheckersBoard, DisplayCheckersPlayer } from "@/checkers/_components";

export const OnlineCheckers: React.FC = ({}) => {
    const { room, clickCell, currentSelectCell } = useOnlineCheckers();

    return (
        <div className="flex w-full lg:max-w-7xl items-center justify-center">
            <div className="flex w-full h-[80svh] items-center justify-center">
                <CheckersBoard
                    board={room?.board}
                    clickCell={clickCell}
                    currentSelectCell={currentSelectCell}
                />
            </div>
            <div className="hidden md:flex flex-col h-[80svh] md:px-4 items-center justify-between">
                <DisplayCheckersPlayer player={room?.players[0]} />
                <DisplayCheckersPlayer player={room?.players[1]} />
            </div>
        </div>
    );
};

const ShowGameStatus: React.FC = () => {
    const { room } = useOnlineCheckers();

    if (!room) return null;

    const { players, currentPlayerId } = room;
    const [player1, player2] = players;

    return (
        <div className="flex flex-col justify-normal bg-muted-foreground gap-4">
            <div
                className={cn(
                    "px-4 py-2 border-b-2",
                    currentPlayerId === player1.id && "animate-pulse",
                )}
            >
                <CheckersPiece
                    className="size-12"
                    variant={player1.color === "BLACK" ? "black" : "orange"}
                />
            </div>
            <div className={cn("px-4 py-2", currentPlayerId === player2.id && "animate-pulse")}>
                <CheckersPiece
                    className="size-12"
                    variant={player2.color === "BLACK" ? "black" : "orange"}
                ></CheckersPiece>
            </div>
        </div>
    );
};
