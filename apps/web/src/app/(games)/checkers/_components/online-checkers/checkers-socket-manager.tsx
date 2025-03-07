"use client";

import React from "react";
import { SocketResponse } from "@/types";

import { toast, useSession } from "@/hooks";
import { useOnlineCheckers } from "@/checkers/_lib/hooks";
import { checkersSocketClient } from "@/lib/socket";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { TCheckers } from "@khel-mitra/shared/types";
import { useGameOptions } from "@/providers";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Show } from "@/components/common";
import { Button } from "@/components/ui/button";

export const CheckersSocketManager: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const checkersGame = useOnlineCheckers();
    const gameOptions = useGameOptions();

    React.useEffect(() => {
        checkersSocketClient.on(GAME_EVENT.ERROR_EVENT, (res: SocketResponse<undefined>) => {
            if (res.error) {
                toast({ description: res.error, variant: "destructive" });
            }
        });

        checkersSocketClient.on(GAME_EVENT.ERROR, (res: SocketResponse<undefined>) => {
            toast({ description: res.error || "Something wrong", variant: "destructive" });
        });

        checkersSocketClient.on(
            GAME_EVENT.START_GAME,
            (res: SocketResponse<{ room: TCheckers }>) => {
                if (res.success) {
                    checkersGame.setStatus("started");
                    if (res.data) checkersGame.setRoom(res.data?.room);
                    toast({ description: "Game started" });
                }
            },
        );

        checkersSocketClient.on(
            GAME_EVENT.INIT_ROOM,
            (res: SocketResponse<{ room: TCheckers }>) => {
                if (res.success && res.data) {
                    checkersGame.setStatus(res.data.room.status);
                    checkersGame.setRoom(res.data?.room);
                }
            },
        );

        checkersSocketClient.on(
            GAME_EVENT.UPDATE_ROOM_STATE,
            (res: SocketResponse<{ room: TCheckers }>) => {
                if (res.success) {
                    console.log("Room updated");
                    if (res.data) checkersGame.setRoom(res.data?.room);
                }
            },
        );

        checkersSocketClient.on(
            GAME_EVENT.GAME_OVER,
            (res: SocketResponse<{ room: TCheckers }>) => {
                toast({ description: "Game over" });
                if (res.data) checkersGame.setRoom(res.data?.room);
                checkersGame.setStatus("finished");
                checkersGame.changeShowDialog("Winnings");
            },
        );

        checkersSocketClient.on("disconnect", () => {
            toast({ description: "You are disconnected from the server", variant: "warning" });
            checkersGame.reset();
            gameOptions.reset();
            checkersGame.setStatus("finished");
        });

        checkersSocketClient.on(GAME_EVENT.PLAYER_LEAVE, () => {
            toast({
                description: "Your opponents left the room",
                variant: "warning",
            });
            checkersGame.reset();
            gameOptions.reset();
            checkersGame.setStatus("finished");
        });

        return () => {
            checkersSocketClient.off(GAME_EVENT.ERROR_EVENT);
            checkersSocketClient.off(GAME_EVENT.ERROR);

            checkersGame.reset();
        };
    }, [checkersGame.reset, gameOptions]);

    return (
        <React.Fragment>
            <Show when={checkersGame.showDialog === "Winnings"}>
                <ShowWinningsDialog />
            </Show>
            {children}
        </React.Fragment>
    );
};

export const ShowWinningsDialog: React.FC = () => {
    const { user } = useSession();
    const checkersGame = useOnlineCheckers();

    if (!checkersGame.room?.winnerId) return null;

    return (
        <ShowDialog
            title="Winnings"
            open={checkersGame.showDialog === "Winnings"}
            onOpenChange={(open) => {
                if (open) checkersGame.changeShowDialog("Winnings");

                checkersGame.changeShowDialog(null);
            }}
        >
            <DialogDescription>
                {user?.id === checkersGame.room?.winnerId ? (
                    <span>Congratulations! You won the game.</span>
                ) : (
                    <span>Sorry, you lost the game.</span>
                )}
            </DialogDescription>
            <DialogFooter>
                <Button variant="default" onClick={checkersGame.restart}>
                    Restart
                </Button>
                <Button variant="outline">Close</Button>
            </DialogFooter>
        </ShowDialog>
    );
};

export const ShowDialog: React.FC<{
    title: string;
    children: React.ReactNode;
    onClose?: () => void;
    onOpenChange: (open: boolean) => void;
    open: boolean;
}> = ({ title, children, onClose, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};
