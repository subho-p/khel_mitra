"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

import { ArrowLeftIcon } from "lucide-react";
import { useGameOptions } from "@/providers";
import { useOnlineCheckers } from "@/checkers/_lib/hooks";
import { RandomPlayerRoom, CreateRoom, JoinRoomForm, OnlineCheckers } from "@/checkers/_components";

export default function CheckersPage() {
    const { playerType, onlinePlayerType, changePlayerType, roomMemberType, back } =
        useGameOptions();
    const { status } = useOnlineCheckers();

    useEffect(() => {
        changePlayerType("Online");
    }, [changePlayerType]);

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
                Something went wrong!
            </div>
        </React.Fragment>
    );
}
