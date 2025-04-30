export const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
        const delay = 0 + i * 0.1;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay, duration: 0.01 },
            },
        };
    },
    exit: (i: number) => {
        const delay = 0 + i * 0.1;
        return {
            pathLength: 0,
            opacity: 0,
            transition: {
                pathLength: { delay, duration: 0.5, ease: "easeInOut" },
                opacity: { delay, duration: 0.2, ease: "easeOut" },
            },
        };
    },
};