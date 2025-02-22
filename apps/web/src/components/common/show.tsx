import React from "react";

interface ShowContentProps<T> {
    data: T | null | undefined;
    children: (data: T) => React.ReactNode;
    fallback?: React.ReactNode;
}

export function ShowContent<T>({
    data,
    children,
    fallback = null,
}: ShowContentProps<T>) {
    if (!data || data === null || data === undefined) {
        return <React.Fragment>{fallback}</React.Fragment>;
    }

    return <React.Fragment>{children(data)}</React.Fragment>;
}

interface ShowProps {
    when: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function Show({ when, children, fallback = null }: ShowProps) {
    if (!when) {
        return <React.Fragment>{fallback}</React.Fragment>;
    }
    return <React.Fragment>{children}</React.Fragment>;
}
