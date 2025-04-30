import { api } from "@/lib/axios";
import { Notification } from "@/types/notification.type";

export const getNotifications = (userId = "me"): Promise<{ notifications: Notification[] }> => {
    return api.get(`/notifications/${userId}`);
};

export const toggleReadNotification = (userId: string, notificationId: string) => {
    return api.patch(`/notifications/${userId}/${notificationId}/toggle-read`);
};

export const deleteNotification = (userId: string, notificationId: string) => {
    return api.delete(`/notifications/${userId}/${notificationId}`);
};
