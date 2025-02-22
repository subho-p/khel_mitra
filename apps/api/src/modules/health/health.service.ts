import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../libs/db/db.service';

@Injectable()
export class HealthService {
    constructor(private prisma: PrismaService) {}

    async checkHealth() {
        const users = await this.prisma.user.count();
        return {
            users,
            server: "I'm up and running!",
        };
    }
}
