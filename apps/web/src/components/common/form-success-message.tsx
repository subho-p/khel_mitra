import React from "react";

export const FormSuccessMessage: React.FC<{
    message?: string;
}> = ({ message }) => {
    if (!message) return null;

    return (
        <p className="text-emerald-100 text-sm bg-emerald-600 rounded-md py-2 px-2">
            {message}
        </p>
    );
};
