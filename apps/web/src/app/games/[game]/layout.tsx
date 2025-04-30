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
    params: Promise<{ game: string }>;
}): Promise<Metadata | undefined> {
    const { game } = await params;
    const data = getGameData(game);

    if (data) {
        return {
            title: data.name,
            description: data.description,
        };
    }
}

export default function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ game: string }>;
}) {
    const { game } = React.use(params);
    const data = getGameData(game);
    if (!data) {
        throw new Error("Game not found");
    }

    return (
        <React.Fragment>
            <div className="flex w-full items-center justify-center">
                <div className="flex flex-col w-full max-w-7xl py-4">
                    <h1 className="text-2xl font-semibold tracking-wide capitalize">{data.name}</h1>
                    <div className="flex flex-col w-full items-center justify-between gap-6 py-8">
                        {children}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
