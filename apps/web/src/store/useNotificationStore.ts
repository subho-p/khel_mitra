import { getNotifications } from "@/services/notification.service";
import { Notification } from "@/types/notification.type";
import { create } from "zustand";
import { useSessionStore } from "./useSessionStore";

interface NotificationStoreState {
    notifications: Notification[];
    error: string;
    isLoading: boolean;
    isRefreshing: boolean;
    noOfUnreadNotifications: number;
    page: number;
}

interface NotificationStoreActions {
    fetchNotifications: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    clearNotifications: () => void;
}

const initialState: NotificationStoreState = {
    notifications: [],
    error: "",
    isLoading: false,
    isRefreshing: false,
    noOfUnreadNotifications: 0,
    page: 1,
};

export const useNotificationStore = create<NotificationStoreState & NotificationStoreActions>(
    (set, get) => ({
        ...initialState,

        async fetchNotifications() {
            const user = useSessionStore.getState().user;
            if (!user) return;

            try {
                set({ isLoading: true });
                const { notifications } = await getNotifications(user.id);
                const noOfUnreadNotifications = notifications.filter(
                    (notification) => !notification.read,
                ).length;
                console.log({ notifications, noOfUnreadNotifications });
                set({ notifications, noOfUnreadNotifications });
            } catch (error) {
                console.error(error);
                set({ error: "Failed to get notifications" });
            } finally {
                set({ isLoading: false });
            }
        },

        addNotification: (notification) => {
            set((state) => ({ notifications: [notification, ...state.notifications] }));
            set((state) => ({ noOfUnreadNotifications: state.noOfUnreadNotifications + 1 }));
        },

        clearNotifications: () => set(initialState),
    }),
);
