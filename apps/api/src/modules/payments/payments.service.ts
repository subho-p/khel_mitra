import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/db.service';
import { PaymentVerifyBody } from './utils/validation.dto';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) {}

    async createPendingPayment(userId: number, orderId: string, amount: number) {
        const coinsData = await this.prisma.gameCoin.findFirst({
            where: { amount },
        });

        await this.prisma.payment.create({
            data: {
                orderId,
                amount,
                userId,
                tokens: coinsData?.coins || 0,
            },
        });
    }

    async completePayment(userId: number, data: PaymentVerifyBody) {
        const payment = await this.prisma.payment.findFirst({
            where: { orderId: data.razorpay_order_id },
        });

        if (!payment) throw new Error('Order not found');

        if (payment.status === 'SUCCESS') return; // Already completed

        // Mark as paid
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                paymentId: data.razorpay_payment_id,
                signature: data.razorpay_signature,
                status: 'SUCCESS',
            },
        });

        // Add coins
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                token: { increment: payment.tokens },
            },
        });

        // Create transaction history
        await this.prisma.transactionHistory.create({
            data: {
                userId,
                amount: payment.amount,
                type: 'PURCHASE',
                reference: data.razorpay_payment_id,
            },
        });
    }

    async updatePaymentStatus(orderId: string, status: 'FAILED' | 'SUCCESS') {
        await this.prisma.payment.updateMany({
            where: { orderId },
            data: { status },
        });
    }
}
