import { create } from "zustand";
import { TTicTacToeRoom } from "../types";

interface State {
    room: TTicTacToeRoom | null;
}

interface TicTacToeGameStore extends State {
    setRoom: (room: TTicTacToeRoom) => void;
    updateRoom: (data: Partial<TTicTacToeRoom> | null) => void;
    reset: () => void;
}

const initialState: State = {
    room: null,
};

export const useTicTacToeGameStore = create<TicTacToeGameStore>((set, get) => ({
    ...initialState,

    setRoom: (room: TTicTacToeRoom) => {
        set({ room });
    },

    updateRoom: (data: Partial<TTicTacToeRoom> | null) => {
        set((state) => ({
            room: state.room ? { ...state.room, ...data } : undefined,
        }));
    },

    reset: () => {
        set({ ...initialState });
    },
}));
