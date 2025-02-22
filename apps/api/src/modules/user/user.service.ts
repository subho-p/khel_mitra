import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/db.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
}
