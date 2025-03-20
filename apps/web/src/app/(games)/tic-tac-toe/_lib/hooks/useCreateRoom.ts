import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { toast } from "@/hooks";
import { TTicTacToeGameInitResponse } from "../types";
import { useTicTacToeSocketListener } from "./useTicTacToeSocketListener";

export const useCreateRoom = () => {
    const { data, error } = useTicTacToeSocketListener<TTicTacToeGameInitResponse["data"]>(
        GAME_EVENT.INIT_ROOM,
    );

    const copyRoomCode = () => {
        const input = document.getElementById("roomCode") as HTMLInputElement;
        if (!data?.room) {
            toast({ description: "No room code to copy", duration: 2000 });
            return;
        }

        navigator.clipboard.writeText(data.room.id);
        toast({ description: "Room Code copied", duration: 2000 });

        input.select();
        setTimeout(() => {
            document.getElementById("createdRoomCode")?.blur();
        }, 2000);
    };

    return {
        roomCode: data?.room.id,
        error: error,
        copyRoomCode,
    };
};
