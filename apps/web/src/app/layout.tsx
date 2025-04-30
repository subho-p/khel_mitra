import type { Metadata } from "next";
import { Play } from "next/font/google";
import "./globals.css";
import App from "./_app";

const play = Play({
    variable: "--font-play",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "Khel Mitra",
        template: "%s | Khel Mitra",
    },
    description:
        "Khel Mitra is a platform for sports enthusiasts to connect, play and compete with each other.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${play.variable} antialiased font-play`}>
                <App>
                    <div className="w-full min-h-screen">{children}</div>
                </App>
            </body>
        </html>
    );
}
