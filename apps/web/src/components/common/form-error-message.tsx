import React from "react";

export const FormErrorMessage: React.FC<{
    error?: string;
}> = ({ error }) => {
    if (!error) return null;

    return (
        <p className="text-destructive text-sm bg-destructive/20 rounded-md py-2 px-2">
            {error}
        </p>
    );
};
