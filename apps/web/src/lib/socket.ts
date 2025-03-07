import { io } from "socket.io-client";
import { getPlayerAccessToken } from "./utils";
import { PLAYER_ACCESS_TOKEN_NAMESPACE } from "@khel-mitra/shared/constanst";

export const socketClient = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
});

export const checkersSocketClient = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/checkers`, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
    auth: {
        [PLAYER_ACCESS_TOKEN_NAMESPACE]: getPlayerAccessToken(),
    },
});
