"use client";

import * as React from "react";
import { Socket } from "socket.io-client";
import { checkersSocketClient } from "@/lib/socket";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";

const STATUS_INTERVAL = 10000;

export default function GameStatusPage({ params }: { params: Promise<{ game: string }> }) {
    const { game } = React.use(params);

    const [socket, setSocket] = React.useState<Socket>();
    const [status, setStatus] = React.useState<any>();

    React.useEffect(() => {
        switch (game) {
            case "checkers":
                console.log("Checkers");
                setSocket(checkersSocketClient);
                break;

            default:
                break;
        }

        function getStatus() {
            if (!socket?.connected) {
                socket?.connect();
            }

            socket?.emit(GAME_EVENT.GAME_STATUS, {}, (res: any) => {
                setStatus(res);
            });
        }

        getStatus();
        const interval = setInterval(() => {
            getStatus();
        }, STATUS_INTERVAL);

        return () => {
            clearInterval(interval);
        };
    }, [game, socket]);

    return (
        <div>
            <h1>Game Status : {game}</h1>
            <pre>{JSON.stringify(status, null, 2)}</pre>
        </div>
    );
}
