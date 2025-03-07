import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DbModule } from './db/db.module';
import { CheckerModule } from './gateways/checkers/checker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, CheckerModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
