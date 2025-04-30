import { Module } from '@nestjs/common';
import { PaymentController } from './payments.controller';
import { PaymentService } from './payments.service';
import { RazorpayService } from './utils/razorpay.service';
import { NotificationGatewayService } from '../notifications/notification.gateway.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService, RazorpayService, NotificationGatewayService, NotificationsService],
})
export class PaymentModule {}
