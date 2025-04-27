import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../libs/db/db.service';
import { GameCoin } from './entities/game-coin.entity';

@Injectable()
export class GameCoinsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<GameCoin[]> {
        return await this.prisma.gameCoin.findMany({
            orderBy: {
                amount: 'asc',
            },
        });
    }
}
