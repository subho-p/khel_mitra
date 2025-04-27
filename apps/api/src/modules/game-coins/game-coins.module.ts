import { Module } from '@nestjs/common';
import { GameCoinsService } from './game-coins.service';
import { GameCoinsController } from './game-coins.controller';

@Module({
  controllers: [GameCoinsController],
  providers: [GameCoinsService],
})
export class GameCoinsModule {}
