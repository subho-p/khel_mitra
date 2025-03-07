import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerFilter } from './common/interceptors';
import { JwtGuard } from './common/guards';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3334);

    app.useGlobalGuards(new JwtGuard());
    app.useGlobalFilters(new CustomLoggerFilter());

    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
