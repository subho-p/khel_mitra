import { PLAYER_ACCESS_TOKEN_NAMESPACE } from "@khel-mitra/shared/constanst";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const localStorageData = (key: string) => {
    try {
        if (typeof window !== "undefined" && localStorage) {
            const data = localStorage.getItem(key);
            if (data) {
                return typeof data === "string" ? data : JSON.stringify(data);
            }
        }
        return null;
    } catch (error) {
        console.error("Error accessing localStorage :: ", +key + " : " + error);
        return null;
    }
};

export const getPlayerAccessToken = () => {
    return localStorageData(PLAYER_ACCESS_TOKEN_NAMESPACE);
};
