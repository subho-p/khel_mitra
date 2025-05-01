import { create } from "zustand";
import { GameStatus } from "@/games/constant";

interface State {}

interface TicTacToeGameStore extends State {
    reset: () => void;
}

const initialState: State = {
    status: "Idle",
};

export const useTicTacToeGameStore = create<TicTacToeGameStore>((set, get) => ({
    ...initialState,

    reset: () => {
        set({ ...initialState });
    },
}));