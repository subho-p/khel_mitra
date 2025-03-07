import { GamepadIcon } from "lucide-react";

export const Games = [
    {
        name: "Tic Tac Toe",
        description: "A game where players take turns marking spaces in a 3x3 grid",
        link: "/tic-tac-toe",
        icon: GamepadIcon,
        tag: ["SinglePlayer", "MultiPlayer", "Online"],
    },
    {
        name: "Checkers",
        description:
            "A strategy board game where two players take turns moving their pieces on a 8x8 grid",
        link: "/checkers",
        icon: GamepadIcon,
        tag: ["MultiPlayer", "Online"],
    },
    {
        name: "Rock Paper Scissors",
        description:
            "A classic two-player game where players take turns choosing between rock, paper, or scissors",
        link: "/rock-paper-scissors",
        icon: GamepadIcon,
        tag: ["SinglePlayer", "MultiPlayer", "Online"],
    },
] as const;
