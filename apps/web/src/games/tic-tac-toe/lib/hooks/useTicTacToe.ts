import * as React from "react";
import { useTicTacToeStore } from "../store/useTicTacToeStore";
import { useLocalGame } from "../store/useLocalGame";
import ticTacToeSocket from "@/tic-tac-toe/lib/ticTacToeSocketService";
import { getPlayerAccessToken } from "@/services/games.service";
import { useLocalStore } from "@/hooks/use-localstore";
import { useTicTacToeGameStore } from "../store/useTicTiaToeGameStore";
import { toast } from "@/hooks";

export const useTicTacToe = () => {
    const { playerType, setStatus, onlinePlayerType, roomMemberType, bettingTokens } =
        useTicTacToeStore();
    const { restartGame } = useLocalGame();
    const localstore = useLocalStore();
    const { setRoom } = useTicTacToeGameStore();

    const startLocalGame = () => {
        restartGame();
        setStatus("Playing");
    };

    const startOnlineGame = async () => {
        setStatus("Waiting");

        const res = await getPlayerAccessToken();
        if (res) {
            const token = res.token;
            localstore.set("player", { token });

            ticTacToeSocket.emit(
                "init",
                {
                    onlinePlayerType,
                    roomMemberType,
                    bettingTokens,
                },
                (res) => {
                    if (!res.success) {
                        setStatus("Idle");

                        toast({
                            title: "Error",
                            description: "Game could not be started",
                            variant: "destructive",
                        });
                        return;
                    }

                    setRoom(res.data.room);
                    setStatus("Playing");
                },
            );
        }
    };

    const startGame = () => {
        if (playerType == "Local") startLocalGame();

        if (playerType == "Online") startOnlineGame();
    };

    return { startGame };
};
