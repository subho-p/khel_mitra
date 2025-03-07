"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { ArrowLeftIcon } from "lucide-react";
import { useGameOptions } from "@/providers";
import { checkersSocketClient } from "@/lib/socket";
import { useOnlineCheckers } from "@/checkers/_lib/hooks";
import { RandomPlayerRoom, CreateRoom, JoinRoomForm, OnlineCheckers } from "@/checkers/_components";

export default function CheckersPage() {
    const { playerType, onlinePlayerType, roomMemberType, back } = useGameOptions();
    const { status } = useOnlineCheckers();

    if (onlinePlayerType && status !== "idle") {
        return <OnlineCheckers />;
    }

    if (onlinePlayerType === "Random") {
        return <RandomPlayerRoom />;
    }

    if (roomMemberType === "Admin") {
        return <CreateRoom />;
    }

    if (roomMemberType === "Player") {
        return <JoinRoomForm />;
    }

    return (
        <React.Fragment>
            <div>
                <Button variant="outline" className="left-3" onClick={back}>
                    <ArrowLeftIcon />
                    Back
                </Button>
            </div>
            <div className="w-full flex items-center justify-center gap-3">
                <Button onClick={() => checkersSocketClient.connect()}>Connect</Button>
                <Button variant="secondary" onClick={() => checkersSocketClient.disconnect()}>
                    Disconnect
                </Button>
            </div>
        </React.Fragment>
    );
}
