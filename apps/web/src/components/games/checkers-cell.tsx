import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const checkersCellVariants = cva(
    "aspect-square h-full border border-neutral-800 flex items-center justify-center hover:bg-neutral-300 p-2 transition transition-all duration-300",
    {
        variants: {
            variant: {
                "default": "bg-neutral-600",
                "unavailable": "bg-neutral-200 hover:bg-neutral-500",
                "highlighted": "bg-primary text-primary-foreground",
                "captured": "bg-destructive-600 text-destructive-foreground",
                "green": "bg-emerald-500 border-2 border-emerald-600"
            },
        },
        defaultVariants:{
            variant: "default",
        }
    },
)

function CheckersCell({
    className,
    variant,
   ...props
}: 
React.ComponentProps<"button"> &
VariantProps<typeof checkersCellVariants> 
) {
    return (
        <button
            data-slot="checkers-cell"
            className={cn(checkersCellVariants({ variant }), className)}
            {...props}
        />
    )
}

export { CheckersCell, checkersCellVariants}