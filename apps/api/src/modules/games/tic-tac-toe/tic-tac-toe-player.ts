import { Player } from '../classes/player.class';
import { JWTPayloadOfPlayer } from '../types';
import { TicTacToeSymbol } from './types';

export class TicTacToePlayer extends Player {
    symbol: TicTacToeSymbol;
    noOfWinings: number;

    constructor(socketId: string, userData: JWTPayloadOfPlayer) {
        super(socketId, userData);
        this.noOfWinings = 0;
        this.symbol = "X";
    }

    setSymbol(symbol: TicTacToeSymbol) {
        this.symbol = symbol;
    }

    serializeData() {
        return {
            ...super.serializeData(),
            noOfWinings: this.noOfWinings,
            symbol: this.symbol,
        };
    }
}
