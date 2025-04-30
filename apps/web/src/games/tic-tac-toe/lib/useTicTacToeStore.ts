import { create } from "zustand";
import {  OnlinePlayerType, PlayerType, RoomMemberType } from "../../constant";

interface State {
    playerType: PlayerType | null;
    onlinePlayerType: OnlinePlayerType | null;
    roomMemberType: RoomMemberType | null;
}

interface TicTacToeStore extends State {
    setPlayerType: (playerType: PlayerType | null) => void;
    setOnlinePlayerType: (onlinePlayerType: OnlinePlayerType | null) => void;
    setRoomMemberType: (roomMemberType: RoomMemberType | null) => void;
    startGame: () => void;
    isCanStart: () => boolean;
    reset: () => void;
}

const initialState: State = {
    playerType: null,
    onlinePlayerType: null,
    roomMemberType: null,
};

export const useTicTacToeStore = create<TicTacToeStore>((set, get) => ({
    ...initialState,

    setPlayerType: (playerType) => set({ playerType, onlinePlayerType: null, roomMemberType: null }),
    setOnlinePlayerType: (onlinePlayerType) => set({ onlinePlayerType, roomMemberType: null }),
    setRoomMemberType: (roomMemberType) => set({ roomMemberType }),

    startGame: () => {
    },

    isCanStart: () => {
        const { playerType, onlinePlayerType, roomMemberType } = get();
        if (playerType == "Local") return false;
        if (onlinePlayerType == "Random") return false;
        if (!roomMemberType) return true;

        return false;
    },

    reset: () => {
        set(initialState);
    },
}));
