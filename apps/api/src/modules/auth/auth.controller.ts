import {
    BadRequestException,
    Body,
    ConflictException,
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
import * as argon from 'argon2';
import { v4 as uuid4 } from 'uuid';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
            const { email, password } = data;
            const hashedPassword = await argon.hash(password);
            const randomUsername = 'user' + uuid4().slice(0, 8);
            const user = await this.prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    username: randomUsername,
                    password: {
                        create: {
                            hash: hashedPassword,
                        },
                    },
                },
            });

            const { accessToken } = await this.authService.setCookies(res, user);

            return res.json({ data: { accessToken } });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email is already registered.');
            }
            throw new BadRequestException(error?.message || 'User sign up failed');
        }
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ZodValidation(signInSchema)
    async signIn(@Body() data: SignInSchema, @Res() res: Response) {
        try {
            const { email, password } = data;
            const user = await this.prisma.user.findUnique({
                where: { email },
                include: { password: true },
            });
            if (!user) {
                throw new BadRequestException('Email not found');
            }
            if (!user.password) {
                throw new BadRequestException('Password not found');
            }
            if (!(await argon.verify(user.password?.hash, password))) {
                throw new BadRequestException('Invalid credentials');
            }

            const { accessToken } = await this.authService.setCookies(res, user);
            return res.json({ data: { accessToken } });
        } catch (error) {
            console.log(error);
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2021') {
                throw new BadRequestException('Invalid credentials');
            }
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
