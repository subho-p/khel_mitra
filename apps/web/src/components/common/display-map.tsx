"use client";

import * as React from "react";

export function DisplayMap<T>({
    data,
    renderItem,
    renderEmpty,
    className,
}: {
    data: T[];
    renderItem: (item: T, index: number, array: T[]) => React.JSX.Element;
    renderEmpty?: () => React.JSX.Element;
    className?: string;
}) {
    if (data.length === 0 && renderEmpty) {
        return renderEmpty();
    }

    return <div className={className}>{data.map(renderItem)}</div>;
}
