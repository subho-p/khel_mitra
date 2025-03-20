import { useToast } from "@/hooks";
import { ticTacToeSocketClient } from "@/lib/socket";
import { SocketResponse } from "@/types";
import { useEffect, useState } from "react";

export const useTicTacToeSocketListener = <T>(event: string) => {
    const { toast } = useToast();

    const [state, setState] = useState<SocketResponse<T>["data"]>();
    const [error, setError] = useState<SocketResponse<T>["error"]>();

    useEffect(() => {
        const handleEvent = (res: SocketResponse<T>) => {
            if (res.success) {
                setState(res.data);
                setError(undefined);
                console.log("State", res.data);
            } else {
                setError(res.error);
                toast({ description: res.message || res.error, variant: "destructive" });
            }
        };
        ticTacToeSocketClient.on(event, handleEvent);

        return () => {
            ticTacToeSocketClient.off(event, handleEvent);
        };
    }, [event, toast]);

    return {
        data: state,
        error,
    };
};
