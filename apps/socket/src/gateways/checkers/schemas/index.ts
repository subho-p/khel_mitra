import z from 'zod';

// Join room schema
export const JoinRoomSchema = z
    .object({
        roomCode: z.string({ required_error: 'Enter valid room code' }),
    })
    .required();

// Checkers pieces move schema
const Index = z.number().int().min(0).max(7);
export const CheckersPiecesMoveSchema = z
    .object({
        roomCode: z
            .string({ message: 'Enter room code', required_error: 'Enter valid room code' })
            .min(1, 'Room code cannot be empty'),
        move: z.object({
            from: z.tuple([Index, Index]),
            to: z.tuple([Index, Index]),
        }),
    })
    .refine(({ move: { from, to } }) => from[0] !== to[0] || from[1] !== from[1], {
        message: 'Move must be to a different position',
        path: ['move', 'to'],
    });

export const RoomCodeSchema = z.object({
    roomCode: z.string().min(1, 'Room code cannot be empty'),
});

export type TJoinRoomSchema = z.infer<typeof JoinRoomSchema>;
export type TCheckersPiecesMoveSchema = z.infer<typeof CheckersPiecesMoveSchema>;
