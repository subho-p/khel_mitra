"use client";

import React, { createContext, useEffect, useState } from "react";
import { TicTacToeCell, TTicTacToeRoom } from "./_lib/types";
import { ticTacToeSocketClient } from "@/lib/socket";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { SocketResponse } from "@/types";
import { useGameOptions } from "@/providers";
import { toast } from "@/hooks";

interface State {
    room: TTicTacToeRoom | null;
    isLoading: boolean;
    isGameOver: boolean;
    winner: string | null;
    winningCombination: number[];
    handleClickToCell: (index: number) => void;
    handleResetGame: () => void;
    updateRoom: (data: Partial<TTicTacToeRoom> | null) => void;
}

export const OnlineTicTacToeContext = createContext<State | null>(null);

export const OnlineTicTacToeProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { reset } = useGameOptions();
    const [room, setRoom] = useState<TTicTacToeRoom | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [winningCombination, setWinningCombination] = useState<number[]>([]);

    const handleClickToCell = (index: number) => {
        if (!room?.id || isGameOver || room.board[index] !== null) return; // Prevent invalid moves
        ticTacToeSocketClient.emit(GAME_EVENT.MOVE_PIECE, {
            roomCode: room.id,
            position: index,
        });
    };

    const handleResetGame = () => {
        if (!room?.id) return; // Ensure room exists
        setIsLoading(true);
        setIsGameOver(false);
        setWinner(null);
        setWinningCombination([]);
        ticTacToeSocketClient.emit(GAME_EVENT.RESTART_GAME, { roomCode: room.id });
    };

    const updateRoom = (data: Partial<TTicTacToeRoom> | null) => {
        setRoom(
            (prevRoom) =>
                ({
                    ...(prevRoom || {}),
                    ...data,
                }) as TTicTacToeRoom,
        );
    };

    useEffect(() => {
        // Listener for game start
        const roomListener = (res: SocketResponse<{ room: TTicTacToeRoom }>) => {
            if (res.success && res.data?.room) {
                updateRoom(res.data.room);
            } else {
                console.error("Failed to join room:", res?.error);
            }
            setIsLoading(false);
        };

        // Listener for game state updates
        const updateListener = (
            res: SocketResponse<{
                board: TicTacToeCell[];
                currentPlayerId: string;
            }>,
        ) => {
            if (res.success && res.data) {
                updateRoom(res.data);
            } else {
                console.error("Failed to update game state:", res?.error);
            }
        };

        // Listener for game over
        const gameOverListener = (
            res: SocketResponse<{
                winner: string;
                winningCombination: number[];
            }>,
        ) => {
            if (res.success && res.data) {
                setIsGameOver(true);
                setWinner(res.data.winner || null);
                setWinningCombination(res.data.winningCombination || []);
            } else {
                console.error("Failed to process game over:", res?.error);
            }
        };

        // Listener for game reset
        const gameRestartListener = (res: SocketResponse<Partial<TTicTacToeRoom>>) => {
            if (res.success && res.data) {
                updateRoom(res.data);
            } else {
                console.error("Failed to reset game:", res?.error);
            }
            setIsLoading(false);
        };

        // Listener for player leaving
        const playerLeaveListener = () => {
            toast({ description: "You are disconnected from the server", variant: "warning" });
            reset();
            setIsLoading(false);
            updateRoom(null);
            setIsGameOver(false);
            setWinner(null);
            setWinningCombination([]);
        };

        ticTacToeSocketClient.on("disconnect", playerLeaveListener);

        ticTacToeSocketClient.on(GAME_EVENT.START_GAME, roomListener);
        ticTacToeSocketClient.on(GAME_EVENT.UPDATE_GAME_STATE, updateListener);
        ticTacToeSocketClient.on(GAME_EVENT.GAME_OVER, gameOverListener);
        ticTacToeSocketClient.on(GAME_EVENT.RESET_GAME, gameRestartListener);
        ticTacToeSocketClient.on(GAME_EVENT.PLAYER_LEAVE, playerLeaveListener);

        return () => {
            ticTacToeSocketClient.off(GAME_EVENT.START_GAME, roomListener);
            ticTacToeSocketClient.off(GAME_EVENT.UPDATE_GAME_STATE, updateListener);
            ticTacToeSocketClient.off(GAME_EVENT.GAME_OVER, gameOverListener);
            ticTacToeSocketClient.off(GAME_EVENT.RESET_GAME, gameRestartListener);
            ticTacToeSocketClient.off(GAME_EVENT.PLAYER_LEAVE, playerLeaveListener);
        };
    }, [reset]);

    return (
        <React.Fragment>
            <OnlineTicTacToeContext.Provider
                value={{
                    room,
                    isLoading,
                    isGameOver,
                    winner,
                    winningCombination,
                    handleClickToCell,
                    handleResetGame,
                    updateRoom,
                }}
            >
                {children}
            </OnlineTicTacToeContext.Provider>
        </React.Fragment>
    );
};
