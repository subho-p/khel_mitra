"use client";

import Link from "next/link";
import * as React from "react";
import { UserButton } from "./user-button";
import { useSession } from "@/hooks";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export const Header: React.FC = () => {
    const { isAuthenticated, user } = useSession();
    const router = useRouter();

    const handleClickToAddToken = () => {
        if (isAuthenticated) {
            router.push("/store");
        } else {
            router.push("/auth/signin");
        }
    };

    return (
        <div className="flex w-full justify-center items-center fixed top-0 border-b z-50 bg-background/40 backdrop-blur-md">
            <header className="flex w-full max-w-7xl justify-between items-center p-4 h-16">
                <Link href="/" className="relative">
                    <h1 className="font-extrabold text-2xl md:text-3xl capitalize tracking-tight bg-gradient-to-tr from-orange-500 to-purple-500 text-transparent bg-clip-text select-none hover:cursor-pointer">
                        KHEL MITRA
                    </h1>
                </Link>
                <nav className="hidden md:flex">
                    <Link href="/" className="px-4 py-2 text-white hover:text-gray-400">
                        Home
                    </Link>
                    <Link href="/games" className="px-4 py-2 text-white hover:text-gray-400">
                        Games
                    </Link>
                    <Link href="/community" className="px-4 py-2 text-white hover:text-gray-400">
                        Community
                    </Link>
                </nav>

                <div className="flex gap-4 items-center justify-center">
                    {isAuthenticated && (
                        <div className="flex gap-2 items-center border border-primary rounded-md shadow">
                            <span className="px-4 py-2 text-primary">{user?.token} tokens</span>
                            <motion.button
                                className="m-1 p-2 bg-primary hover:bg-primary/80 cursor-pointer rounded-sm"
                                onClick={handleClickToAddToken}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                aria-label="Add Token"
                            >
                                <Plus className="w-4 h-4" />
                            </motion.button>
                        </div>
                    )}
                    <UserButton />
                </div>
            </header>
        </div>
    );
};
