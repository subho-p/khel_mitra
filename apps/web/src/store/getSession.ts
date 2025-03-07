import { create } from "zustand";
import { TUser } from "@khel-mitra/shared/types";

interface GetSession {
    user?: TUser;
    isAuthenticated: boolean;
    setSession: (user?: TUser) => void;
}

export const sessionStore = create<GetSession>(() => ({
    user: undefined,
    isAuthenticated: false,
    setSession: (user) => ({
        user,
        isAuthenticated: !!user,
    }),
}));
