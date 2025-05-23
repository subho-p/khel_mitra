import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

import * as argon from 'argon2';
import { User } from '@prisma/client';
import { PrismaService } from '../../libs/db/db.service';
import { ACCESS_TOKEN_NAMESPACE, REFRESH_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';
import { COOKIE_SETTINGS, REFRESH_TOKEN_EXPIRATION, TOKEN_EXPIRATION } from 'src/libs/constants';
import { SignUpSchema } from '@khel-mitra/shared/validator';
import { v4 as uuid4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotificationGatewayService } from '../notifications/notification.gateway.service';
import { JobQueueService } from '../share/job-queue.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private noficationService: NotificationGatewayService,
        private jobQueueService: JobQueueService,
    ) {}

    generateUserName() {
        return 'user' + uuid4().slice(0, 8);
    }

    async createUser(data: SignUpSchema) {
        try {
            return await this.prisma.user.create({
                data: {
                    email: data.email.toLowerCase(),
                    username: this.generateUserName(),
                    password: {
                        create: {
                            hash: await this.hashPassword(data.password),
                        },
                    },
                },
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email is already registered.');
            }
            throw new BadRequestException(error?.message || 'User sign up failed');
        }
    }

    findUserByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    findUserPasswordByUserId(userId: number) {
        return this.prisma.userPassword.findUnique({ where: { userId } });
    }

    async hashPassword(password: string) {
        return await argon.hash(password);
    }

    async verifyPassword(hash: string, password: string) {
        return await argon.verify(hash, password);
    }

    async addRefreshToken(userId: number, token: string) {
        const hashToken = await argon.hash(token);
        await this.prisma.refreshToken.upsert({
            where: { userId },
            update: { token: hashToken, expiresAt: REFRESH_TOKEN_EXPIRATION },
            create: { userId, token: hashToken, expiresAt: REFRESH_TOKEN_EXPIRATION },
        });
    }

    async validateRefreshToken(token: string, userId: number): Promise<boolean> {
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

    async removeRefreshToken(userId: number): Promise<void> {
        try {
            await this.prisma.refreshToken.delete({ where: { userId } });
        } catch {
            throw new BadRequestException('Failed to remove refresh token');
        }
    }

    private signAccessToken(user: User) {
        return this.jwtService.sign(
            { sub: user.id, id: user.id, username: user.username },
            {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: TOKEN_EXPIRATION.ACCESS,
            },
        );
    }

    private signRefreshToken(userId: number) {
        return this.jwtService.sign(
            { sub: userId },
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: TOKEN_EXPIRATION.REFRESH,
            },
        );
    }

    generateTokens(user: User) {
        const accessToken = this.signAccessToken(user);
        const refreshToken = this.signRefreshToken(user.id);
        return { accessToken, refreshToken };
    }

    async setCookies(res: Response, user: User) {
        const tokens = this.generateTokens(user);

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

    async sendNotification(userId: number, data: { title: string; body: string }) {
        const notificationJob = async () => {
            return await this.noficationService.sendNewNotification(userId, {
                type: 'APPLICATION',
                title: data.title,
                body: data.body,
            });
        };

        await this.jobQueueService.addJob(notificationJob);
    }
}
