"use client";

import { Button } from "@/components/ui/button";
import { GameCoin } from "@/types/game-coins.type";
import Image from "next/image";

interface CoinCardProps extends GameCoin {
    onBuy: () => void;
    isPending: boolean;
}

export const CoinCard: React.FC<CoinCardProps> = ({
    id,
    coins,
    amount,
    imageUrl,
    onBuy,
    isPending,
}) => (
    <div
        key={id}
        className="w-full flex flex-col items-center justify-between py-2 px-4 border bg-card rounded-md"
    >
        <div className="w-full aspect-square border rounded-md">
            <Image
                height="100"
                width="100"
                alt="coins"
                src={imageUrl || "/coins.png"}
                className="w-full rounded-md"
            />
        </div>
        <div className="flex flex-col items-center gap-2 w-full text-xl py-1">
            <div className="flex w-full justify-between">
                <div className="text-primary font-semibold">{coins} coins</div>
                <div className="font-semibold bg-primary rounded-full px-3">
                    <span>{amount / 100}</span>
                    <span className="px-2">₹</span>
                </div>
            </div>
            <Button className="w-full" onClick={onBuy} disabled={isPending}>
                Buy Now
            </Button>
        </div>
    </div>
);
