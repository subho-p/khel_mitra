import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';

import { AppModule } from './modules/app.module';

import { CustomLoggerFilter } from './libs/interceptors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({ origin: 'http://localhost:3000', credentials: true });

    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalFilters(new CustomLoggerFilter());

    await app.listen(process.env.PORT ?? 3333);

    Logger.log(`Server running on http://localhost:${process.env.PORT ?? 3333}`, 'NestApplication');
}

bootstrap();
