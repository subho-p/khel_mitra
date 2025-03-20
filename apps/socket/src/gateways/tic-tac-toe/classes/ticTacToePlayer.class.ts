import { Player } from '../../../common/classes';
import { TicTacToeSymbol, TTicTacToePlayer } from '../types';
import { TUser } from '@khel-mitra/shared/types';

export class TicTacToePlayer extends Player implements TTicTacToePlayer {
    constructor(
        socketId: string,
        user: TUser,
        public symbol: TicTacToeSymbol,
        public noOfWinings: number = 0,
        public isReady: boolean = true,
    ) {
        super(socketId, user);
    }

    status(isReady: boolean) {
        this.isReady = isReady;
    }

    serialize(): Omit<TTicTacToePlayer, 'socketId'> {
        return {
            ...super.serialize(),
            symbol: this.symbol,
            noOfWinings: this.noOfWinings,
        };
    }
}
