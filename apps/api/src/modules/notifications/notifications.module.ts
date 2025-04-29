import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationGatewayService } from './notification.gateway.service';

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationGateway, NotificationGatewayService],
})
export class NotificationsModule {}
