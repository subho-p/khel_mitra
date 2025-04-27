import prisma from "./index.js";

const gameToken = [
    {
        coins: 100,
        amount: 8000,
    },
    {
        coins: 200,
        amount: 16000,
    },
    {
        coins: 500,
        amount: 32000,
    },
    {
        coins: 1000,
        amount: 60000,
    },
    {
        coins: 2000,
        amount: 110000,
    },
    {
        coins: 5000,
        amount: 200000,
    },
];

async function seeds() {
    try {
        await prisma.gameCoin.createMany({ data: gameToken });

        console.log("[Seed]: done!");
    } catch (error: any) {
        console.log(error?.message);
    }
}

seeds();
