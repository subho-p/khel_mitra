"use client";

import React from "react";
import Link from "next/link";
import { Games } from "@/constants";
import { motion } from "motion/react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DisplayMap } from "@/components/common/display-map";

export default function GamesPage() {
    return (
        <div className="w-full py-8 px-4">
            <motion.h1
                className="text-4xl font-bold mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Our Games
            </motion.h1>

            <div className="flex w-full items-center justify-center">
                <div className="w-full max-w-7xl">
                    <DisplayMap
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        data={Games}
                        renderItem={(game, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                key={index}
                            >
                                <GameCard game={game} />
                            </motion.div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

const GameCard: React.FC<{
    game: (typeof Games)[number];
}> = ({ game }) => {
    return (
        <Card className="h-full flex flex-col shadow-inner ring-0 hover:ring-[1px] hover:ring-inset transition-all duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <game.icon size={40} />
                    {game.name}
                </CardTitle>
                <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                    {game.tag.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button asChild>
                    <Link href={game.link}>Play Now</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href={`${game.link}/leaderboard`}>Leaderboard</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
