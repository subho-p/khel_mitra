import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    signInSchema,
    signUpSchema,
    SignInSchema,
    SignUpSchema,
} from '@khel-mitra/shared/validator';

import { AuthService } from './auth.service';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/libs/guards';
import { PrismaService } from 'src/libs/db/db.service';
import { GetUser, ZodValidation } from '../../libs/decorators';

import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { REFRESH_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
    ) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ZodValidation(signUpSchema)
    async signUp(@Body() data: SignUpSchema, @Res() res: Response) {
        try {
            const user = await this.authService.createUser(data);
            const { accessToken } = await this.authService.setCookies(res, user);

            await this.authService.sendNotification(user.id, {
                title: 'Welcome to Khel Mitra',
                body: 'You have successfully signed up',
            });

            return res.json({ data: { accessToken } });
        } catch (error) {
            throw new BadRequestException(error?.message || 'User sign up failed');
        }
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ZodValidation(signInSchema)
    async signIn(@Body() data: SignInSchema, @Res() res: Response) {
        try {
            const user = await this.authService.findUserByEmail(data.email);
            if (!user) {
                throw new BadRequestException('Email not found');
            }
            const userPassword = await this.authService.findUserPasswordByUserId(user.id);
            if (!userPassword) {
                throw new BadRequestException('Password not found');
            }

            const isValidPassword = await this.authService.verifyPassword(
                userPassword.hash,
                data.password,
            );
            if (!isValidPassword) {
                throw new BadRequestException('Invalid credentials');
            }

            const { accessToken } = await this.authService.setCookies(res, user);
            await this.authService.sendNotification(user.id, {
                title: 'Welcome to Khel Mitra',
                body: 'You have successfully signed in',
            });
            return res.json({ data: { accessToken } });
        } catch (error) {
            throw new BadRequestException(error?.message || 'User sign up failed');
        }
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const token = req.cookies[REFRESH_TOKEN_NAMESPACE];
        if (!token) {
            throw new BadRequestException('Invalid refresh token provided');
        }
        const decodeToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
        const userId = (decodeToken as any).sub;

        // validate the user
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // validate the refresh token in the database
        const theRefreshToken = await this.authService.validateRefreshToken(token, userId);
        if (!theRefreshToken) {
            throw new BadRequestException('Invalid refresh token provided');
        }

        const { accessToken } = await this.authService.setCookies(res, user);
        return res.json({ data: { accessToken } });
    }

    @Post('signout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async logout(@GetUser() user: User, @Res() res: Response) {
        try {
            if (!user) {
                throw new BadRequestException('Invalid access token provided');
            }

            // remove refresh token from database
            await this.authService.removeRefreshToken(user.id);

            // remove refresh token from cookie
            this.authService.clearCookies(res);
            return res.json({ message: 'User successfully sign out.' });
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error?.message || 'User signed out failed');
        }
    }

    @Post('check')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    check(@GetUser() user: User) {
        try {
            if (!user) {
                throw new BadRequestException('Invalid access token provided');
            }
            return { message: 'User is authenticated' };
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message || 'User check failed');
        }
    }
}
