import { Controller, Get } from '@nestjs/common';
import { GameCoinsService } from './game-coins.service';

@Controller('game-coins')
export class GameCoinsController {
    constructor(private readonly gameCoinsService: GameCoinsService) {}

    @Get()
    async findAll() {
        const gameCoins = await this.gameCoinsService.findAll();

        return {
            success: true,
            data: { gameCoins },
        };
    }
}
