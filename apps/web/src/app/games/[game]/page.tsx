import { TicTacToePage } from "@/games/tic-tac-toe/components/page";
import React from "react";

export const GameParams = ["tic-tac-toe", "checkers", "rock-paper-scissors"] as const;

export default function Page({
    params,
}: {
    params: Promise<{ game: (typeof GameParams)[number] }>;
}) {
    const { game } = React.use(params);

    if (game === "tic-tac-toe") return <TicTacToePage />;

    return (
        <React.Fragment>
            <div className="w-full py-10">
                <div className="flex flex-col w-full items-center justify-center py-8">
                    <p>{game} is coming soon 🔥</p>
                </div>
            </div>
        </React.Fragment>
    );
}
