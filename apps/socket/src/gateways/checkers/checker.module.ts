import { Module } from '@nestjs/common';
import { CheckerGateway } from './checker.gateway';
import { CheckersService } from './checker.service';

@Module({
    providers: [CheckerGateway, CheckersService],
    exports: [CheckersService],
})

export class CheckerModule {}
