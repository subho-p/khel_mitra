import { CHECKERS_BOARD_SIZE } from "../constant";

export function isBounded(row: number, col: number): boolean {
    return row >= 0 && row < CHECKERS_BOARD_SIZE && col >= 0 && col < CHECKERS_BOARD_SIZE;
}