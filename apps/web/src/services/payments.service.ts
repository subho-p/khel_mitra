import { api } from "@/lib/axios";
import { CreateNewOrderSchema, PaymentVerifySchema } from "@/schemas/payment.schema";
import { OrderData } from "@/types/razorpay.type";

const createNewOrder = async (
    data: CreateNewOrderSchema,
): Promise<{
    order: OrderData;
}> => {
    return await api.post("/payments/checkout", data);
};

const verifyPayment = async (data: PaymentVerifySchema): Promise<any> => {
    return await api.post("/payments/verify", data);
};

export { createNewOrder, verifyPayment };
