import { Module } from '@nestjs/common';
import { PaymentController } from './payments.controller';
import { PaymentService } from './payments.service';
import { RazorpayService } from './utils/razorpay.service';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService, RazorpayService],
})
export class PaymentModule {}
