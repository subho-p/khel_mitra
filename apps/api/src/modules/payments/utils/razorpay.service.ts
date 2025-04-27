import Razorpay from 'razorpay';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Orders } from 'razorpay/dist/types/orders';
import { PaymentVerifyBody } from './validation.dto';

@Injectable()
export class RazorpayService implements OnModuleInit {
    private razorpayInstance: Razorpay;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        this.initializeRazorpay();
    }

    private initializeRazorpay() {
        this.razorpayInstance = new Razorpay({
            key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
        });
    }

    getInstance(): Razorpay {
        if (!this.razorpayInstance) {
            throw new Error('Razorpay instance not initialized');
        }
        return this.razorpayInstance;
    }

    async createOrder(
        params:
            | Orders.RazorpayOrderCreateRequestBody
            | Orders.RazorpayTransferCreateRequestBody
            | Orders.RazorpayAuthorizationCreateRequestBody,
    ) {
        return await this.getInstance().orders.create(params);
    }

    verifyPaymentSignature(params: PaymentVerifyBody): boolean {
        const generatedSignature = createHmac(
            'sha256',
            this.configService.get<string>('RAZORPAY_KEY_SECRET')!,
        )
            .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
            .digest('hex');

        return generatedSignature === params.razorpay_signature;
    }
}
