import prisma from "./index.js";

const gameToken = [
    {
        tokens: 100,
        amount: 8000,
    },
    {
        tokens: 200,
        amount: 16000,
    },
    {
        tokens: 500,
        amount: 32000,
    },
    {
        tokens: 1000,
        amount: 60000,
    },
    {
        tokens: 2000,
        amount: 110000,
    },
    {
        tokens: 5000,
        amount: 200000,
    },
];


async function seeds() {
    try {
        await prisma.gameToken.createMany({ data: gameToken });

        console.log("[Seed]: done!");
    } catch (error: any) {
        console.log(error?.message);
    }
}

seeds();
