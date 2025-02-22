"use client";

import Link from "next/link";
import * as React from "react";
import { UserButton } from "./user-button";

export const Header: React.FC = ({}) => {
    return (
        <div className="flex w-full justify-center items-center fixed top-0 border-b z-50 bg-background/40 backdrop-blur-md">
            <header className="flex w-full max-w-7xl justify-between items-center p-4 h-16">
                <Link href="/" className="relative">
                    <h1 className="font-extrabold text-2xl md:text-3xl capitalize tracking-tight bg-gradient-to-tr from-orange-500 to-purple-500 text-transparent bg-clip-text select-none hover:cursor-pointer">
                        KHEL MITRA
                    </h1>
                </Link>
                <nav className="hidden md:flex">
                    <Link
                        href="/"
                        className="px-4 py-2 text-white hover:text-gray-400"
                    >
                        Home
                    </Link>
                    <Link
                        href="/games"
                        className="px-4 py-2 text-white hover:text-gray-400"
                    >
                        Games
                    </Link>
                    <Link
                        href="/community"
                        className="px-4 py-2 text-white hover:text-gray-400"
                    >
                        Community
                    </Link>
                </nav>
                <UserButton />
            </header>
        </div>
    );
};
