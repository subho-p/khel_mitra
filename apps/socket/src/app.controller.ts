import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { DbService } from './db/db.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private dbService: DbService,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @HttpCode(HttpStatus.OK)
    @Get('health')
    async getHealth() {
        const users = await this.dbService.user.count();
        return { Users: users };
    }
}
