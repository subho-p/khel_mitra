import { api } from "@/lib/axios";
import { GameCoin } from "@/types/game-coins.type";

export const getGameCoins = (): Promise<{ gameCoins: GameCoin[] }> => {
    return api.get("/game-coins");
};
