import z from 'zod';

export const createOrderBody = z.object({
    amount: z.coerce.number({ required_error: 'amount is required' }),
});

export const paymentVerifyBody = z
    .object({
        razorpay_order_id: z.string({ required_error: 'razorpay_order_id is required' }),
        razorpay_payment_id: z.string({ required_error: 'razorpay_payment_id is required' }),
        razorpay_signature: z.string({ required_error: 'razorpay_signature is required' }),
    })
    .required();

export type CreateOrderBody = z.infer<typeof createOrderBody>;
export type PaymentVerifyBody = z.infer<typeof paymentVerifyBody>;
