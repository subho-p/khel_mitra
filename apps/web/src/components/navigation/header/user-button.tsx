"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Bell, BellDot, LogOut, Settings, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSession } from "@/hooks";
import { signout } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/useSessionStore";
import { useNotificationStore } from "@/store/useNotificationStore";

export const UserButton: React.FC = ({}) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { clearSession } = useSessionStore();
    const { noOfUnreadNotifications } = useNotificationStore();

    const { isAuthenticated, user } = useSession();

    const { mutate: userSignout } = useMutation({
        mutationKey: ["user", "signout"],
        mutationFn: signout,
        onSuccess: () => {
            console.log("User signed out");
            clearSession();
            queryClient.clear();
        },
        onError: () => {},
        onSettled: () => {
            router.refresh();
        },
    });

    if (!isAuthenticated) {
        return (
            <Button
                className="text-md font-bold hover:cursor-pointer px-6 py-3"
                onClick={() => router.push("/auth/signin")}
            >
                Sign in
            </Button>
        );
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="size-10 ring-2 inset-ring-ring ring-ring/50 cursor-pointer">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback>
                            <User2 />
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <React.Fragment>
                        <DropdownMenuItem onClick={() => router.push("/profile")}>
                            <User2 className="mr-1 size-4" />
                            My Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/notifications")}>
                            {noOfUnreadNotifications > 0 ? (
                                <BellDot className="mr-1 size-4" />
                            ) : (
                                <Bell className="mr-1 size-4" />
                            )}
                            Notifications
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/settings")}>
                            <Settings className="mr-1 size-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => userSignout()}
                            className="text-destructive"
                        >
                            <LogOut className="mr-1 size-4" />
                            Sign out
                        </DropdownMenuItem>
                    </React.Fragment>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
