import { create } from "zustand";
import { TUser } from "@khel-mitra/shared/types";
import { refreshToken } from "@/services/auth.service";
import { getMe } from "@/services/user.service";

interface State {
    user?: TUser;
    isAuthenticated: boolean;
    status: "pending" | "authenticated" | "unauthenticated";
    error?: string;
}

interface GetSession extends State {
    setSession: (user?: TUser) => void;

    fetchUserData: () => Promise<void>;
    refreshToken: () => Promise<void>;

    clearSession: () => void;
}

const initialState: State = {
    user: undefined,
    isAuthenticated: false,
    status: "pending",
};

export const useSessionStore = create<GetSession>((set, get) => ({
    ...initialState,

    setSession: (user) => ({
        user,
        isAuthenticated: !!user,
    }),

    fetchUserData: async () => {
        try {
            const { user } = await getMe();
            set({ user, status: "authenticated", isAuthenticated: true });
        } catch {
            set({ error: "Failed to get user", status: "unauthenticated", isAuthenticated: false });
        }
    },

    refreshToken: async () => {
        try {
            await refreshToken();

            get().fetchUserData();
        } catch {
            set({ error: "Failed to refresh token", status: "unauthenticated", isAuthenticated: false });
            get().clearSession();
        }
    },

    clearSession: () => {
        set({ ...initialState, status: "unauthenticated" });
    },
}));
