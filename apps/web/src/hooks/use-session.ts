import React from "react";
import { SessionContext } from "@/providers";

export const useSession = () => {
    const context = React.useContext(SessionContext);
    return context;
};
