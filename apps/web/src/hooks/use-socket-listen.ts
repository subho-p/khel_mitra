"use client";

import React from "react";
import { Socket } from "socket.io-client";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { useToast } from "./use-toast";
import { CheckersSocketResponse } from "@/types";

export const useSocketListener = <K extends keyof CheckersSocketResponse>(
    socket: Socket,
    event: K,
): {
    data?: CheckersSocketResponse[K]["data"];
    error?: Error;
} => {
    const { toast } = useToast();

    const [state, setState] = React.useState<CheckersSocketResponse[K]["data"]>();
    const [error, setError] = React.useState<Error>();

    React.useEffect(() => {
        socket.on(event as string, (res: CheckersSocketResponse[K]) => {
            console.log(res);
            if (res.success) {
                setState(res.data);
            }
        });

        socket.on(GAME_EVENT.ERROR, (err: Error) => {
            setError(err);
            console.error(err);

            toast({
                description: err.message || `Somthing wrong ${event}`,
                variant: "destructive",
            });
        });

        return () => {
            socket.off(event);
            socket.off(GAME_EVENT.ERROR);
        };
    }, [socket, event, toast]);

    return {
        data: state,
        error,
    };
};
