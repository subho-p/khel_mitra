"use client";

import { checkersSocketClient } from "@/lib/socket";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import * as React from "react";

export const RandomPlayerRoom: React.FC = ({}) => {
    React.useEffect(() => {
        checkersSocketClient.emit(GAME_EVENT.RANDOM_ROOM);
        return () => {};
    }, []);

    return <div>Waiting for others players to join...</div>;
};
