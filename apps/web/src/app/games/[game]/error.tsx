"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    console.error(error);
    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center h-[80vh]">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong!</h2>
            <p className="mb-4">{error?.message}</p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
                <Button onClick={() => reset()}>Try Again</Button>
            </div>
        </div>
    );
}
