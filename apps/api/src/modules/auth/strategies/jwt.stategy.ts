import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from 'src/libs/db/db.service';
import { ACCESS_TOKEN_NAMESPACE } from '@khel-mitra/shared/constanst';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: (request: Request) => {
                const token =
                    request.cookies[ACCESS_TOKEN_NAMESPACE] ||
                    request.headers?.authorization?.split(' ')[1];
                return token ? token : null;
            },
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
        });
    }

    async validate(payload: { sub: string }) {
        if (!payload || !payload.sub) {
            throw new UnauthorizedException('Invalid access token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (user) {
            const { password, ...withOutPassword } = user;
            return withOutPassword;
        }

        return null;
    }
}
