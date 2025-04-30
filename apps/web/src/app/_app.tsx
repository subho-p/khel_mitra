"use client";

import React, { useEffect } from "react";
import * as providers from "@/providers";
import { Toaster } from "@/components/ui/toaster";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useSessionStore } from "@/store/useSessionStore";
import Loading from "@/components/Loading";

export default function App({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = React.useState(false);

    const { notifications, fetchNotifications, clearNotifications } =
        useNotificationStore();
    const { refreshToken, status } = useSessionStore();

    React.useEffect(() => {
        async function initData() {
            await refreshToken().then(() => {
                fetchNotifications();
            });
        }

        initData();
    }, [refreshToken, fetchNotifications]);

    React.useEffect(() => {
        const interval = setInterval(refreshToken, 9_00_000);

        return () => clearInterval(interval);
    }, [refreshToken]);

    React.useEffect(() => {
        return () => {
            clearNotifications();
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (status === "pending" || !isMounted) {
        return <Loading />;
    }

    console.log("App re-render", notifications);

    return (
        <React.Fragment>
            <providers.QueryClientProvider>
                {/* <providers.SessionProvider> */}
                {children}
                <Toaster />
                {/* </providers.SessionProvider> */}
            </providers.QueryClientProvider>
        </React.Fragment>
    );
}
