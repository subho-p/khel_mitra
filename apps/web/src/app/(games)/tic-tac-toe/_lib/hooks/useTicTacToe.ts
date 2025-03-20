import { useContext } from "react";
import { OnlineTicTacToeContext } from "../../OnlineTicTacToeProvider";

export const useTicTacToe = () => {
    const context = useContext(OnlineTicTacToeContext)
    if(!context){
        throw new Error("useTicTacToe must be used within OnlineTicTacToeProvider")
    }

    return context;
};
