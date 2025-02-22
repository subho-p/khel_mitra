import { api } from "@/lib/axios";
import { SignInSchema, SignUpSchema } from "@khel-mitra/shared/validator";

interface AuthResponse {
    accessToken: string;
}

export const signin = async (data: SignInSchema): Promise<AuthResponse> => {
    return await api.post("/auth/signin", data);
};

export const signup = async (data: SignUpSchema): Promise<AuthResponse> => {
    return await api.post("/auth/signup", data);
};

export const refreshToken = async (): Promise<AuthResponse> => {
    return await api.post("/auth/refresh-token");
};

export const signout = async (): Promise<void> => {
    return await api.post("/auth/signout");
};

export const checkAuth = async (): Promise<void> => {
    return await api.get("/auth/check");
};
