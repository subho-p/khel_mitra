import {
    getNotifications,
    toggleReadNotification,
    deleteNotification,
} from "@/services/notification.service";
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
    toggleRead: (id: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
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
            try {
                set({ isLoading: true });
                const { notifications } = await getNotifications();
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

        toggleRead: async (id) => {
            const user = useSessionStore.getState().user;
            if (!user) return;
            const isRead = get().notifications.find((notification) => notification.id === id)?.read;
            if (isRead) return;

            try {
                await toggleReadNotification(user.id, id);
                const notifications = get().notifications.map((notification) => {
                    if (notification.id === id) {
                        return { ...notification, read: !notification.read };
                    }
                    return notification;
                });

                set({
                    notifications,
                    noOfUnreadNotifications: get().noOfUnreadNotifications - 1,
                });
            } catch (error) {
                console.error(error);
            }
        },

        deleteNotification: async (id) => {
            const user = useSessionStore.getState().user;
            if (!user) return;

            try {
                await deleteNotification(user.id, id);
                const notifications = get().notifications.filter(
                    (notification) => notification.id !== id,
                );
                const noOfUnreadNotifications = notifications.filter(
                    (notification) => !notification.read,
                ).length;
                set({ notifications, noOfUnreadNotifications });
            } catch (error) {
                console.error(error);
            }
        },

        clearNotifications: () => set(initialState),
    }),
);
