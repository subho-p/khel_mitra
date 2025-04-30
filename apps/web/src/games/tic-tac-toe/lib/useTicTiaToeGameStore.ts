import { create } from "zustand";
import { GameStatus } from "../../constant";

interface State {
    status: GameStatus;
}

interface TicTacToeGameStore extends State{
    setStatus: (status: GameStatus) => void;
    reset: () => void;
}

const initialState: State = {
    status: "Idle",
};

export const useTicTacToeGameStore = create<TicTacToeGameStore>((set, get) => ({
    ...initialState,

    setStatus: (status) => {
        set({ status });
    },

    reset: () => {
        set({ ...initialState });
    },
}));