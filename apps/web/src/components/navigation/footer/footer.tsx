"use client";

import Link from "next/link";
import * as React from "react";

export const Footer: React.FC = ({}) => {
    return (
        <footer className="text-muted-foreground bg-muted/20 py-8 border-t-2">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; 2025 KHEL MITRA. All rights reserved.</p>
                <div className="mt-4">
                    <Link
                        href="#"
                        className="hover:text-primary transition-colors mr-4"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                    >
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
};
