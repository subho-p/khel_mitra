export const generateRoomId = () => {
    const random = Math.random() * 1000000;
    return Math.floor(random).toString()
};
