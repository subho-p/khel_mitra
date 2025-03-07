"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { DisplayMap } from "@/components/common";

import { checkersSocketClient } from "@/lib/socket";
import { GamePlayerType, Games, OnlinePlayerType, RoomMemberType } from "@/constants";

import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { SocketResponse } from "@/types";
import { PLAYER_ACCESS_TOKEN_NAMESPACE } from "@khel-mitra/shared/constanst";

interface GameOptionsContextState {
    playerType?: GamePlayerType;
    onlinePlayerType?: OnlinePlayerType;
    roomMemberType?: RoomMemberType;
}

interface GameOptionsContextAction {
    changePlayerType: (type: GamePlayerType) => void;
    changeOnlinePlayerType: (type: OnlinePlayerType) => void;
    chnageRoomMemberType: (type: RoomMemberType) => void;

    back: () => void;
    reset: () => void;
}

type GameOptionsContext = GameOptionsContextState & GameOptionsContextAction;

const GameOptionsContext = React.createContext<GameOptionsContext | undefined>(undefined);

export const GameOptionsProvider = ({
    children,
    game,
    className,
}: {
    children: React.ReactNode;
    game: (typeof Games)[number]["name"];
    className?: string;
}) => {
    const [playerType, changePlayerType] = React.useState<GamePlayerType>();
    const [onlinePlayerType, setOnlinePlayerType] = React.useState<OnlinePlayerType>();
    const [roomMemberType, setRoomMemberType] = React.useState<RoomMemberType>();

    function changeOnlinePlayerType(type: OnlinePlayerType) {
        setOnlinePlayerType(type);

        if (game === "Checkers") {
            checkersSocketClient.connect();
        }
    }

    function chnageRoomMemberType(roomMemberType: RoomMemberType) {
        setRoomMemberType(roomMemberType);

        if (roomMemberType === "Admin") {
            checkersSocketClient.emit(GAME_EVENT.CREATE_ROOM);
        }
    }

    function back() {
        reset();
    }

    function reset() {
        changePlayerType(undefined);
        setOnlinePlayerType(undefined);
        setRoomMemberType(undefined);
    }

    React.useEffect(() => {
        checkersSocketClient.on("token", (res: SocketResponse<{ token: string }>) => {
            console.log(res)
            if (res.data && res.data.token) {
                localStorage.setItem(PLAYER_ACCESS_TOKEN_NAMESPACE, res.data.token);
            }
        });

        return () => {
            if (game === "Checkers" && checkersSocketClient.connected) {
                checkersSocketClient.disconnect();
            }
            localStorage.removeItem(PLAYER_ACCESS_TOKEN_NAMESPACE);
            reset();
        };
    }, [game]);

    if (!playerType) {
        return (
            <div className="flex flex-col items-center justify-center py-6 min-h-[40svh]">
                <h3 className="mb-10">Select Player Type</h3>
                <DisplayMap
                    className="flex gap-4 items-center"
                    data={[...GamePlayerType]}
                    renderItem={(data, index) => (
                        <div key={index}>
                            <Button onClick={() => changePlayerType(data)}>{data} Player</Button>
                        </div>
                    )}
                />
            </div>
        );
    }

    if (playerType === "Online" && !onlinePlayerType) {
        return (
            <div className="flex flex-col items-center justify-center py-6 min-h-[40svh]">
                <h3 className="mb-10">Select Player Type</h3>
                <DisplayMap
                    className="flex gap-4 items-center"
                    data={[...OnlinePlayerType]}
                    renderItem={(data, index) => (
                        <div key={index}>
                            <Button onClick={() => changeOnlinePlayerType(data)}>
                                Play with {data}
                            </Button>
                        </div>
                    )}
                />
            </div>
        );
    }

    if (onlinePlayerType === "Friend" && !roomMemberType) {
        return (
            <div className="flex flex-col items-center justify-center py-6 min-h-[40svh]">
                <h3 className="mb-10">What you want</h3>
                <div className="flex gap-4 items-center">
                    <Button onClick={() => chnageRoomMemberType("Admin")}>Create new room</Button>
                    <Button onClick={() => chnageRoomMemberType("Player")}>Join a room</Button>
                </div>
            </div>
        );
    }

    return (
        <GameOptionsContext.Provider
            value={{
                playerType,
                onlinePlayerType,
                roomMemberType,
                changePlayerType,
                changeOnlinePlayerType,
                chnageRoomMemberType,
                back,
                reset,
            }}
        >
            {children}
        </GameOptionsContext.Provider>
    );
};

export const useGameOptions = () => {
    const context = React.useContext(GameOptionsContext);

    if (!context) {
        throw new Error("useGameOptions must be used within GameOptionsProvider");
    }

    return context;
};
