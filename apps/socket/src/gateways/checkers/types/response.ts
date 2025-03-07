import { TCheckersPlayer } from '@khel-mitra/shared/types';

export type PlayerAddedResponse = {
    player: TCheckersPlayer;
    roomCode: string;
};

export type CheckersGobalState = {
    noOfPlayers: number;
    noOfRooms: number;
}    