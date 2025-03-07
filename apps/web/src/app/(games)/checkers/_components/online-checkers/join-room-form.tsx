"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkersSocketClient } from "@/lib/socket";
import { useSocketListener } from "@/hooks/use-socket-listen";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { SocketResponse } from "@/types";
import { toast } from "@/hooks";

export const JoinRoomForm: React.FC = () => {
    const [errorMsg, setErrorMsg] = useState<string>();
    const { error } = useSocketListener(checkersSocketClient, GAME_EVENT.JOIN_ROOM);

    function joinARoom(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMsg(undefined);

        // get room code by input id
        const inputElement = document.getElementById("joiningRoomCode") as HTMLInputElement;
        const roomCode = inputElement.value;

        if (!roomCode) {
            setErrorMsg("Room code is required");
            return;
        }

        if (!checkersSocketClient.connected) checkersSocketClient.connect();

        checkersSocketClient.emit(
            GAME_EVENT.JOIN_ROOM,
            { roomCode },
            (res: SocketResponse<undefined>) => {
                if (res.error) {
                    setErrorMsg(res.error);

                    toast({ description: res.error, variant : "destructive" });
                    return;
                }
                toast({ description: "Room joined successfully" });
            },
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-6 min-h-[40svh]">
            <form onSubmit={joinARoom} className="flex flex-col max-w-md">
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
                        />
                        {(error || errorMsg) && (
                            <p className="text-sm text-red-500">{errorMsg || error?.message}</p>
                        )}
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
