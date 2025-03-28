import React from "react";
import { Metadata } from "next";
import { GameOptionsProvider } from "@/providers";

export const metadata: Metadata = {
    title: "TicTacToe",
    description: "TicTacToe",
};

export default function TicTacToeLayout({ children }: { children: React.ReactNode }) {
    return (
        <React.Fragment>
            <div className="w-full py-10">
                <h1 className="text-2xl font-semibold tracking-wide text-center">Tic Tac Toe</h1>
                <GameOptionsProvider game="Tic Tac Toe">
                    <div className="flex flex-col w-full items-center justify-between gap-6 py-8">
                        {children}
                    </div>
                </GameOptionsProvider>
            </div>
        </React.Fragment>
    );
}
