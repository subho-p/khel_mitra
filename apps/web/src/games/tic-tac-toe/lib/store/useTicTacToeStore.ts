import { create } from "zustand";
import {
    BettingTokens,
    GameStatus,
    OnlinePlayerType,
    PlayerType,
    RoomMemberType,
} from "@/games/constant";

interface State {
    status: GameStatus;
    playerType: PlayerType | null;
    onlinePlayerType: OnlinePlayerType | null;
    roomMemberType: RoomMemberType | null;
    bettingTokens: BettingTokens;
}

interface TicTacToeStore extends State {
    setStatus: (status: GameStatus) => void;
    setPlayerType: (playerType: PlayerType | null) => void;
    setOnlinePlayerType: (onlinePlayerType: OnlinePlayerType | null) => void;
    setRoomMemberType: (roomMemberType: RoomMemberType | null) => void;
    setBettingTokens: (bettingTokens: BettingTokens) => void;
    startGame: () => void;
    isCanStart: () => boolean;
    reset: () => void;
}

const initialState: State = {
    status: "Idle",
    playerType: null,
    onlinePlayerType: null,
    roomMemberType: null,
    bettingTokens: 100,
};

export const useTicTacToeStore = create<TicTacToeStore>((set, get) => ({
    ...initialState,

    setStatus: (status) => set({ status }),
    setPlayerType: (playerType) =>
        set({ playerType, onlinePlayerType: null, roomMemberType: null }),
    setOnlinePlayerType: (onlinePlayerType) => set({ onlinePlayerType, roomMemberType: null }),
    setRoomMemberType: (roomMemberType) => set({ roomMemberType }),
    setBettingTokens: (bettingTokens) => set({ bettingTokens }),

    startGame: () => {},

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
