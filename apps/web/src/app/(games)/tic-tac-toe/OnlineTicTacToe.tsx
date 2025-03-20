"use client";

import React, { useEffect } from "react";
import { useGameOptions } from "@/providers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useJoinRoom } from "./_lib/hooks/useJoinRoom";
import { useTicTacToe } from "./_lib/hooks/useTicTacToe";
import { useCreateRoom } from "./_lib/hooks/useCreateRoom";
import { TicTacToeBoard } from "./TicTacToeBoard";
import * as motion from "motion/react-client";
import { useSession } from "@/hooks";
import { AnimatePresence } from "motion/react";
import { SocketResponse } from "@/types";
import { TicTacToeCell, TTicTacToeRoom } from "./_lib/types";
import { ticTacToeSocketClient } from "@/lib/socket";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";


export const OnlineTicTacToe = () => {
    const {
        isLoading,
        room,
        handleClickToCell,
        winner,
        isGameOver,
        handleResetGame,
        winningCombination,
    } = useTicTacToe();
    const { roomMemberType } = useGameOptions();
    const { user } = useSession();

    if (room) {
        if (isLoading) {
            return <div>Loading...</div>;
        }
        return (
            <div className="container flex w-full items-center justify-center relative">
                <TicTacToeBoard
                    board={[...(room.board || [])]}
                    handleClick={handleClickToCell}
                    winningCombination={winningCombination}
                />
                <AnimatePresence>
                    <div className="w-full m-2 max-w-md absolute">
                        {isGameOver && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inset-0 w-full h-full text-white text-center font-bold text-xl rounded-md bg-background/80 border py-4 px-2 space-y-4"
                            >
                                <div className="flex flex-col gap-4">
                                    <p>Game over!</p>
                                </div>

                                {!winner && <p>It&apos;s drawn</p>}
                                {winner && winner === user?.id ? (
                                    <p className="text-base text-emerald-500">You won the game</p>
                                ) : (
                                    <p className="text-base text-destructive">You lost the game</p>
                                )}

                                <Button onClick={handleResetGame}>Restart Game</Button>
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
            </div>
        );
    }

    if (roomMemberType === "Admin") {
        return <CreateRoom />;
    }

    if (roomMemberType === "Player") {
        return <JoinRoomForm />;
    }
};

export const CreateRoom = () => {
    const { roomCode, copyRoomCode } = useCreateRoom();

    if (!roomCode) {
        return <div>Creating Room...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center py-6 min-h-[40svh]">
            <div className="flex flex-col max-w-md">
                <div>
                    <Label className="text-base">Room Code:</Label>
                </div>
                <div className="flex gap-4">
                    <div>
                        <Input
                            id="roomCode"
                            type="text"
                            readOnly
                            value={roomCode}
                            autoFocus
                            aria-description="Room Code"
                        />
                        <p className="text-sm text-muted py-1">
                            To invite players, share this room code with them. They will need to
                            join the same room code to start playing.
                        </p>
                    </div>
                    <Button onClick={copyRoomCode}>Copy code</Button>
                </div>
            </div>
        </div>
    );
};

export const JoinRoomForm: React.FC = () => {
    const { handleJoinRoom, roomCode, setRoomCode, errorMsg } = useJoinRoom();

    return (
        <div className="flex flex-col items-center justify-center py-6 min-h-[40svh]">
            <form onSubmit={handleJoinRoom} className="flex flex-col max-w-md">
                <div className="py-1">
                    <Label className="text-base">Room Code:</Label>
                </div>
                <div className="flex gap-4">
                    <div>
                        <Input
                            id="joiningRoomCode"
                            type="text"
                            autoFocus
                            aria-description="Room Code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                        />
                        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
                        <p className="text-sm text-muted py-1">
                            Enter room code for joining the room
                        </p>
                    </div>
                    <Button>Join Room</Button>
                </div>
            </form>
        </div>
    );
};
