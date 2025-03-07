import React from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto w-full min-h-screen">
            <main className="w-full">{children}</main>
        </div>
    );
}
