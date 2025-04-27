"use client";

import { useClickOutSide } from "@/hooks";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export const ModalView = ({
    children,
    className,
    layoutId,
    open,
    onClose,
}: {
    children: React.ReactNode;
    className?: string;
    layoutId?: string;
    open: boolean;
    onClose: () => void;
}) => {
    const ref = useClickOutSide(() => onClose());

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen min-h-[100svh] backdrop-blur-xs"
                >
                    <motion.div
                        ref={ref}
                        layoutId={layoutId}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                        }}
                        className={cn(
                            "rounded-md pt-5 pb-4 px-4 border bg-background/60 min-w-md relative",
                            className,
                        )}
                    >
                        {children}
                        <button className="absolute top-2 right-2 cursor-pointer" onClick={onClose}>
                            <X className="size-4" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
