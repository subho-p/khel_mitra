import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from '../libs/db/db.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ThrottlerModule.forRoot([{ ttl: seconds(30), limit: 10 }]),
        JwtModule.register({ global: true }),
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UserModule,
        HealthModule,
        PrismaModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
