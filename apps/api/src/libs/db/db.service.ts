import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        if (process.env.NODE_ENV === 'development') {
            await this.$connect();
        }
    }

    async onModuleDestroy() {
        // Perform any necessary database migrations or seeding here
        await this.$disconnect();
    }
}
