import React from "react";

export default function GamePage({ params }: { params: Promise<{ game: string }> }) {
    const { game } = React.use(params);

    return (
        <React.Fragment>
            <div className="w-full py-10">
                <h1 className="text-2xl font-semibold tracking-wide text-center">{game}</h1>
                <div className="flex flex-col w-full items-center justify-center py-8">
                    <p>
                        {game} is coming soon 🔥
                    </p>
                </div>
            </div>
        </React.Fragment>
    );
}
