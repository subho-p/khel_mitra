import { api } from "@/lib/axios";
import { TUser } from "@khel-mitra/shared/types";

export const getMe = async (): Promise<{ user: TUser }> => {
    return await api.get("/users/me");
};
