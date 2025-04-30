import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { NotificationGatewayService } from '../notifications/notification.gateway.service';
import { JobQueueService } from '../share/job-queue.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
    imports: [JwtModule.register({ global: true })],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        NotificationGatewayService,
        NotificationsService,
        JobQueueService,
    ],
    exports: [JwtModule],
})
export class AuthModule {}
