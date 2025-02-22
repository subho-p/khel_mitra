import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
    <T extends keyof User | undefined>(data: T, ctx: ExecutionContextHost) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (data) {
            return data in user ? user[data] : null;
        }
        return user;
    },
);
