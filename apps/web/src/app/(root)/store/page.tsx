"use client";

import React, { useState } from "react";
import { useSession } from "@/hooks";
import { useCoinsData } from "./_libs/useCoinsData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewOrder, verifyPayment } from "@/services/payments.service";
import { loadRazorpay } from "@/lib/razorpay";
import { toast } from "@/hooks";
import { CoinCard } from "./_components/coin-card";
import { ProcessingModal } from "./_components/processing-modal";
import { OrderData } from "@/types/razorpay.type";

export default function StorePage() {
  const { user } = useSession();
  const { gameCoins } = useCoinsData();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: onPaymentVerify } = useMutation({
    mutationKey: ["user", "checkout", "verify"],
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      toast({
        title: "Payment successful",
        description: "Tokens added to your account",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Payment failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
      setIsOpen(false);
    },
  });

  const handleOpenRazorpayWindow = async (order: OrderData) => {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
    if (!key) {
      throw new Error("Razorpay key not found");
    }

    try {
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Khel Mitra",
        description: "Add tokens to your account",
        order_id: order.id,
        handler: onPaymentVerify,
        prefill: {
          name: user?.username,
          email: user?.email,
        },
        notes: {
          address: "Khel Mitra Corporate Office",
        },
        theme: {
          color: "#ea580c",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setIsOpen(false);
            toast({
              title: "Payment failed",
              description: "Please try again",
              variant: "destructive",
            });
          },
        },
      };

      //@ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setIsOpen(false);
      toast({
        title: "Payment failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const { mutate: onBuyToken, isPending } = useMutation({
    mutationKey: ["user", "checkout"],
    mutationFn: createNewOrder,
    onSuccess: (data) => {
      const order = data.order;
      if (!order) {
        console.error("Order not found");
      }
      handleOpenRazorpayWindow(order);
    },
  });

  const handleClickBuyToken = async (amount: number) => {
    await loadRazorpay();
    onBuyToken({ amount });
  };

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-7xl">
        <h1 className="text-2xl font-semibold tracking-wide mb-4">Store</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameCoins.map((coin) => (
            <CoinCard
              key={coin.id}
              id={coin.id}
              coins={coin.coins}
              amount={coin.amount}
              imageUrl={coin.imageUrl}
              onBuy={() => handleClickBuyToken(coin.amount)}
              isPending={isPending}
            />
          ))}
        </div>
      </div>
      <ProcessingModal isOpen={isOpen} isProcessing={isProcessing} />
    </div>
  );
}
