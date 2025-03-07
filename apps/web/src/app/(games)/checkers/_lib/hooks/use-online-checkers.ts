import { create } from "zustand";
import { checkersSocketClient } from "@/lib/socket";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import {
    GameStatus,
    TCheckers,
    TCheckersBoard,
    TCheckersCell,
    TCheckersPlayer,
} from "@khel-mitra/shared/types";
import { findPossibleMoves, nonHighlightedBoard } from "../utils";

type ShowDialogType = "Winnings" | null;

interface useOnlineCheckersState {
    status: GameStatus;
    room?: TCheckers;
    currentSelectCell?: TCheckersCell;
    showDialog: ShowDialogType;
}

interface useOnlineCheckersActions {
    setStatus: (status: GameStatus) => void;
    setRoom: (room: TCheckers) => void;
    setBoard: (board: TCheckersBoard) => void;
    changeShowDialog: (showDialog: ShowDialogType) => void;
    clickCell: (cell: TCheckersCell) => Promise<void>;
    resetHighlightCells: () => void;
    getCurrentPlayerById: (id: string) => TCheckersPlayer | undefined;
    makeMove: (from: TCheckersCell["position"], to: TCheckersCell["position"]) => void;
    restart: () => void;
    reset: () => void;
}

type useOnlineCheckers = useOnlineCheckersState & useOnlineCheckersActions;

const INITIAL_CHECKERS_STATE: useOnlineCheckersState = {
    status: "idle",
    room: undefined,
    currentSelectCell: undefined,
    showDialog: null,
};

export const useOnlineCheckers = create<useOnlineCheckers>((set, get) => ({
    ...INITIAL_CHECKERS_STATE,

    setStatus: (status) => {
        set({ status });
    },

    setRoom: (room) => {
        set({ room: { ...room } });
    },

    changeShowDialog: (showDialog) => {
        set({ showDialog });
    },

    setBoard(board) {
        set((state) => ({
            room: state.room ? { ...state.room, board } : undefined,
        }));
    },

    clickCell: async (cell) => {
        const { currentSelectCell, makeMove, room, setBoard } = get();
        if (!cell.isValid) return;

        // Deselecting a selected cell
        if (
            currentSelectCell &&
            cell.position.toString() === currentSelectCell.position.toString()
        ) {
            set({ currentSelectCell: undefined });
            const board = room?.board || [];
            setBoard(nonHighlightedBoard(board));
            return;
        }

        // Highlight valid moves for a piece
        if (cell.piece) {
            const board = nonHighlightedBoard(get().room?.board || []);
            const moves = findPossibleMoves(board, cell, room?.currentPlayerId);
            moves.forEach(({ move: { position }, captures }) => {
                const [col, row] = position;
                board[col][row].isHighlighted = true;
                captures?.forEach(({ position }) => {
                    const [col, row] = position;
                    board[col][row].isHighlighted = true;
                });
            });
            set({ currentSelectCell: cell });
            get().setBoard(board);
            return;
        }

        // Moving the selected piece
        if (currentSelectCell?.piece && !cell.piece) {
            makeMove(currentSelectCell.position, cell.position);
            set({ currentSelectCell: undefined });
            return;
        }

        // Set the clicked cell as selected
        set({ currentSelectCell: cell });
        const board = room?.board || [];
        setBoard(nonHighlightedBoard(board));
    },

    resetHighlightCells() {
        const board = nonHighlightedBoard(get().room?.board || []);
        get().setBoard(board);
    },

    getCurrentPlayerById(id) {
        return get().room?.players.find((p) => p.id === id);
    },

    makeMove: (from, to) => {
        const { room } = get();
        checkersSocketClient.emit(GAME_EVENT.MOVE_PIECE, {
            roomCode: room?.code,
            move: { from, to },
        });
    },

    restart() {
        const { room, reset, setStatus } = get();
        const roomCode = room?.code;

        reset();
        setStatus("pending");

        setTimeout(() => {
            checkersSocketClient.emit(GAME_EVENT.PLAYER_READY, {
                roomCode,
            });
        }, 500);
    },

    reset: () => {
        set({
            status: INITIAL_CHECKERS_STATE.status,
            room: INITIAL_CHECKERS_STATE.room,
            currentSelectCell: INITIAL_CHECKERS_STATE.currentSelectCell,
            showDialog: INITIAL_CHECKERS_STATE.showDialog,
        });
    },
}));
