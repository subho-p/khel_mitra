"use client";

import { Notification } from "@/types/notification.type";
import * as motion from "motion/react-client";
import { X } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationPage() {
    const { notifications } = useNotificationStore();

    return (
        <div className="w-full py-8 px-4 flex items-center justify-center">
            <div className="flex w-full max-w-3xl flex-col gap-4">
                <h2 className="text-2xl font-semibold tracking-wide mb-8 text-start">
                    Notifications
                </h2>
                <NotificationList
                    notifications={notifications}
                    onClickNotification={() => {}}
                    onDeleteNotification={() => {}}
                />
            </div>
        </div>
    );
}

const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            when: "beforeChildren",
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

const NotificationList = ({
    notifications,
    onClickNotification,
    onDeleteNotification,
}: {
    notifications: Notification[];
    onClickNotification: (notification: Notification) => void;
    onDeleteNotification: (id: string) => void;
}) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-4"
        >
            {notifications.map((notification) => (
                <motion.div
                    key={notification.id}
                    variants={cardVariants}
                    role="button"
                    tabIndex={0}
                    onClick={() => onClickNotification(notification)}
                    className="relative w-full cursor-pointer flex flex-col gap-2 p-4 border bg-secondary rounded-lg hover:bg-secondary/90 hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                    aria-label={`Notification: ${notification.title}`}
                >
                    {/* Delete button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(notification.id);
                        }}
                        className="absolute top-2 right-3 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        aria-label="Delete notification"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-foreground">
                            {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground">{notification.body}</p>

                    <div className="absolute top-0 right-0 h-full w-2.5 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-r-md" />
                </motion.div>
            ))}
        </motion.div>
    );
};
