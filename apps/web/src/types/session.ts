import { TUser } from "@khel-mitra/shared/types";

export type Session = {
    user?: TUser;
    isAuthenticated: boolean;
};