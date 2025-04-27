import z from "zod";

export const createNewOrderSchema = z.object({
    amount: z.number(),
});

export const paymentVerifySchema = z.object({
    razorpay_payment_id: z.string(),
    razorpay_order_id: z.string(),
    razorpay_signature: z.string(),
});



export type CreateNewOrderSchema = z.infer<typeof createNewOrderSchema>;
export type PaymentVerifySchema = z.infer<typeof paymentVerifySchema>