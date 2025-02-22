import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';

import * as argon from 'argon2';
import { User } from '@prisma/client';
import { PrismaService } from '../../libs/db/db.service';
import { ACCESS_TOKEN_NAMESPACE, REFRESH_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';
import { COOKIE_SETTINGS, REFRESH_TOKEN_EXPIRATION, TOKEN_EXPIRATION } from 'src/libs/constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async addRefreshToken(userId: string, token: string) {
        const hashToken = await argon.hash(token);
        await this.prisma.refreshToken.upsert({
            where: { userId },
            update: { token: hashToken, expiresAt: REFRESH_TOKEN_EXPIRATION },
            create: { userId, token: hashToken, expiresAt: REFRESH_TOKEN_EXPIRATION },
        });
    }

    async validateRefreshToken(token: string, userId: string): Promise<boolean> {
        try {
            const refreshToken = await this.prisma.refreshToken.findUnique({ where: { userId } });
            if (!refreshToken) {
                return false;
            }
            const isValidToken = await argon.verify(refreshToken?.token, token);
            return isValidToken && refreshToken?.expiresAt > new Date();
        } catch {
            return false;
        }
    }

    async removeRefreshToken(userId: string): Promise<void> {
        try {
            await this.prisma.refreshToken.delete({ where: { userId } });
        } catch {
            throw new BadRequestException('Failed to remove refresh token');
        }
    }

    private signAccessToken(userId: string) {
        return this.jwtService.sign(
            { sub: userId },
            {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: TOKEN_EXPIRATION.ACCESS,
            },
        );
    }

    private signRefreshToken(userId: string) {
        return this.jwtService.sign(
            { sub: userId },
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: TOKEN_EXPIRATION.REFRESH,
            },
        );
    }

    generateTokens(userId: string) {
        const accessToken = this.signAccessToken(userId);
        const refreshToken = this.signRefreshToken(userId);
        return { accessToken, refreshToken };
    }

    async setCookies(res: Response, user: User) {
        const tokens = this.generateTokens(user.id);

        await this.addRefreshToken(user.id, tokens.refreshToken);

        res.cookie(REFRESH_TOKEN_NAMESPACE, tokens.refreshToken, {
            ...COOKIE_SETTINGS,
            expires: REFRESH_TOKEN_EXPIRATION,
        });
        res.cookie(ACCESS_TOKEN_NAMESPACE, tokens.accessToken, { ...COOKIE_SETTINGS });

        return tokens;
    }

    clearCookies(res: Response): void {
        res.clearCookie(REFRESH_TOKEN_NAMESPACE);
        res.clearCookie(ACCESS_TOKEN_NAMESPACE);
    }
}
