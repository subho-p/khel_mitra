import { useState } from "react";
import { SocketResponse } from "@/types";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { ticTacToeSocketClient } from "@/lib/socket";

export const useJoinRoom = () => {
    const [roomCode, setRoomCode] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!roomCode) {
            setErrorMsg("Room code is required");
            return;
        }

        if (!ticTacToeSocketClient.connected) {
            ticTacToeSocketClient.connect();
        }
        setTimeout(() => {
            ticTacToeSocketClient.emit(GAME_EVENT.JOIN_ROOM, { roomCode }, (res: SocketResponse<any>) => {
                if (res.error) {
                    setErrorMsg(res.error);
                }
            });
        }, 200);
    };

    return { roomCode, setRoomCode, errorMsg, handleJoinRoom };
};
