import { User } from '@prisma/client';
import { GetUser } from 'src/libs/decorators';
import { JwtAuthGuard } from 'src/libs/guards';
import { Controller, Get, UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@GetUser() user: Omit<User, 'password'>) {
        try {
            return { data: { user } };
        } catch (error) {
            throw new Error('Failed to get user');
        }
    }
}
