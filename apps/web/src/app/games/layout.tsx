import React from "react";
import { Header } from "@/components/navigation";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <React.Fragment>
            <Header />
            <div className="container flex w-full min-h-[calc(100svh)] justify-center pt-16">
                <main className="w-full">{children}</main>
            </div>
        </React.Fragment>
    );
}
