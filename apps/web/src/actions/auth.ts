"use server";

import { ACCESS_TOKEN_NAMESPACE } from "@khel-mitra/shared/constanst";
import { TUser } from "@khel-mitra/shared/types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

interface Session {
    user?: TUser;
    isAuthenticated: boolean;
}


export const session = async (): Promise<Session> => {
    const cookie = await cookies();

    const accessToken = cookie.get(ACCESS_TOKEN_NAMESPACE)?.value;
    if (!accessToken) {
        return { user: undefined, isAuthenticated: false };
    }

    try {
        const payload: any = await jwtVerify(
            accessToken,
            new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!),
        );
        const user = {
            id: payload.sub,
            username: payload.username,
            avatarUrl: payload.avatarUrl,
        };
        return { user, isAuthenticated: true };
    } catch (error) {
        console.error("JWT validation error:", error);
        return { user: undefined, isAuthenticated: false };
    }
};
