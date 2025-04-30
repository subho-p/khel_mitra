import { Games } from "@/constants";
import { Metadata } from "next";
import React from "react";

const getGameData = (game: string) => {
    const gameName = game
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return Games.find((g) => g.name === gameName);
};

export async function generateMetadata({
    params,
}: {
    params: { game: string };
}): Promise<Metadata | undefined> {
    const data = getGameData(params.game);

    if (data) {
        return {
            title: data.name,
            description: data.description,
        };
    }
}

export default function CheckersLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { game: string };
}) {
    const data = getGameData(params.game);
    if (!data) {
        throw new Error("Game not found");
    }

    return (
        <React.Fragment>
            <div className="w-full py-10">
                <h1 className="text-2xl font-semibold tracking-wide text-center">{params.game}</h1>
                <div className="flex flex-col w-full items-center justify-between gap-6 py-8">
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
}
