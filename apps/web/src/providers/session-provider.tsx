"use client";

import React from "react";
import { getMe } from "@/services/user.service";
import { refreshToken } from "@/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "@/types";

export const SessionContext = React.createContext<Session>({
    user: undefined,
    isAuthenticated: false,
});

export const SessionProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const queryClient = useQueryClient();

    // Fetch user from the server
    const { data, isSuccess } = useQuery({
        queryKey: ["user", "me"],
        queryFn: getMe,
        refetchOnWindowFocus: false,
    });

    // Refresh the session - for some intervals
    const { mutate: userTokenRefresh } = useMutation({
        mutationKey: ["session", "refresh"],
        mutationFn: refreshToken,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        },
        onError: () => {},
    });

    React.useEffect(() => {
        userTokenRefresh();

        const interval = setInterval(
            () => {
                userTokenRefresh();
            },
            15 * 60 * 1000,
        );

        return () => clearInterval(interval);
    }, [userTokenRefresh, data]);

    return (
        <SessionContext.Provider
            value={{
                user: data?.user,
                isAuthenticated: isSuccess,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};
