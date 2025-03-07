import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const checkersPieceVariants = cva(
    "inline-flex items-center justify-center h-full w-full rounded-full border transition-[border-color,background-color] focus:outline-none ring-4",
    {
        variants: {
            variant: {
                "black": "bg-gradient-to-t to-neutral-600 from-neutral-800 border-black ring-neutral-800",
                "orange": "bg-gradient-to-b to-red-400 from-red-600 ring-red-800 border-red-700",
            },
        },
        defaultVariants:{

        }
    },
)

function CheckersPiece({
    className,
    variant,
   ...props
}: 
React.ComponentProps<"div"> &
VariantProps<typeof checkersPieceVariants> 
) {
    return (
        <div
            data-slot="checkers-piece"
            className={cn(checkersPieceVariants({ variant }), className)}
            {...props}
        />
    )
}

export { CheckersPiece, checkersPieceVariants};