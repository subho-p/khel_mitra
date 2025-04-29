import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationGateway } from './notification.gateway';

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationGateway],
    exports: [NotificationGateway],
})
export class NotificationsModule {}
