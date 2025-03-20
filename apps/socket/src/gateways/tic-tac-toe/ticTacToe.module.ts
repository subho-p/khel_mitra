import { Module } from '@nestjs/common';
import { TicTacToeGateway } from './ticTacToe.gateway';
import { TicTacToeService } from './ticTacToe.service';

@Module({
    providers: [TicTacToeGateway, TicTacToeService],
    exports: [TicTacToeService],
})
export class TicTacToeModule {}
