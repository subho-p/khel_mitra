import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { RazorpayService } from './utils/razorpay.service';
import { GetUser } from 'src/libs/decorators';
import {
    CreateOrderBody,
    createOrderBody,
    PaymentVerifyBody,
    paymentVerifyBody,
} from './utils/validation.dto';
import { JwtAuthGuard } from 'src/libs/guards';
import { User } from '@prisma/client';
import { PaymentService } from './payments.service';
import { ZodValidationPipe } from 'src/libs/pipes';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
    constructor(
        private razor: RazorpayService,
        private service: PaymentService,
    ) {}

    @Post('checkout')
    @HttpCode(HttpStatus.OK)
    async createOrder(
        @Body(new ZodValidationPipe(createOrderBody)) body: CreateOrderBody,
        @GetUser() user: User,
    ) {
        const order = await this.razor.createOrder({
            amount: body.amount,
            currency: 'INR',
        });

        // create payment
        await this.service.createPendingPayment(user?.id, order.id, body.amount);
        return {
            success: true,
            data: { order },
        };
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    async paymentVerify(
        @Body(new ZodValidationPipe(paymentVerifyBody)) data: PaymentVerifyBody,
        @GetUser() user: User,
    ) {
        const isValid = this.razor.verifyPaymentSignature(data);

        if (!isValid) {
            await this.service.updatePaymentStatus(data.razorpay_order_id, 'FAILED');
            throw new BadRequestException('Payment verification failed');
        }

        await this.service.completePayment(user.id, data);

        return { success: true, message: 'Payment successful' };
    }
}
