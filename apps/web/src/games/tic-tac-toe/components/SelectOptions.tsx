"use client";

import { Button } from "@/components/ui/button";
import { PlayerType, OnlinePlayerType } from "@/games/constant";
import { useTicTacToeStore } from "@/tic-tac-toe/lib/useTicTacToeStore";

export const SelectOptions = ({ startGame }: { startGame: () => void }) => {
    const {
        playerType,
        onlinePlayerType,
        roomMemberType,
        setPlayerType,
        setOnlinePlayerType,
        setRoomMemberType,
        isCanStart,
    } = useTicTacToeStore();

    return (
        <div className="w-full max-w-xl px-4 flex flex-col items-center justify-center">
            <h4 className="text-2xl font-semibold">Select options</h4>
            <div className="flex flex-col w-full gap-8 pt-8">
                {/* select player type */}
                <div className="flex w-full justify-between items-center">
                    <h5 className="">Player type</h5>
                    <div className="flex items-center justify-between gap-4">
                        {PlayerType.map((type) => (
                            <Button
                                key={type}
                                variant={playerType === type ? "default" : "secondary"}
                                onClick={() => setPlayerType(type)}
                            >
                                {type} Player
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Select online player */}
                {playerType === "Online" && (
                    <div className="flex w-full justify-between items-center">
                        <h5 className="">Online player type</h5>
                        <div className="flex items-center justify-between gap-4">
                            {OnlinePlayerType.map((type) => (
                                <Button
                                    key={type}
                                    variant={onlinePlayerType === type ? "default" : "secondary"}
                                    onClick={() => setOnlinePlayerType(type)}
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* select room member */}
                {onlinePlayerType === "Friend" && (
                    <div className="flex w-full justify-between items-center">
                        <h5 className="">Room Member</h5>
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant={roomMemberType === "Admin" ? "default" : "secondary"}
                                onClick={() => setRoomMemberType("Admin")}
                            >
                                Create Room
                            </Button>
                            <Button
                                variant={roomMemberType === "Player" ? "default" : "secondary"}
                                onClick={() => setRoomMemberType("Player")}
                            >
                                Join Room
                            </Button>
                        </div>
                    </div>
                )}

                <Button onClick={startGame} disabled={isCanStart()}>
                    Start Game
                </Button>
            </div>
        </div>
    );
};
