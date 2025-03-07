import React from "react";
import { Metadata } from "next";
import { GameOptionsProvider } from "@/providers";
import { CheckersSocketManager } from "./_components";

export const metadata: Metadata = {
    title: "Checkers",
    description: "Checkers Game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <React.Fragment>
            <div className="w-full max-h-screen container mx-auto">
                <div className="w-full max-w-7xl items-center justify-center mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-8">
                        <h1 className="text-start text-3xl">Checkers</h1>
                    </div>
                    <GameOptionsProvider game="Checkers">
                        <CheckersSocketManager>
                            <div className="flex w-full items-center justify-center py-6">
                                <div className="w-full flex flex-col gap-3">{children}</div>
                            </div>
                        </CheckersSocketManager>
                    </GameOptionsProvider>
                </div>
            </div>
        </React.Fragment>
    );
}
