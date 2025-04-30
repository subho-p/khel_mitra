import { notificationService } from "@/socket/services/notification.service";
import { useEffect } from "react";

export const useListenNotification = <T>(event: string, callback: (data: T) => void) => {
    useEffect(() => {
        notificationService.on(event, callback);
        return () => {
            notificationService.off(event, callback);
        };
    }, [event, callback]);
};
