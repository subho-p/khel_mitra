"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSession } from "@/hooks";
import { signout } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const UserButton: React.FC = ({}) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { isAuthenticated, user } = useSession();

    const { mutate: userSignout } = useMutation({
        mutationKey: ["user", "signout"],
        mutationFn: signout,
        onSuccess: () => {
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
            queryClient.clear();
        },
        onError: () => {},
    });

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
                    {isAuthenticated ? (
                        <React.Fragment>
                            <DropdownMenuItem
                                onClick={() => router.push("/profile")}
                            >
                                My Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => router.push("/settings")}
                            >
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => userSignout()}>
                                Sign out
                            </DropdownMenuItem>
                        </React.Fragment>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => router.push("/auth/signin")}
                        >
                            Sign in
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
