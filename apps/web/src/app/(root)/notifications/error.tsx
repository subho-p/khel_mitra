"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong!</h2>
      <p className="mb-4">{error?.message}</p>
      <Button variant="secondary"
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
      >
        Try Again
      </Button>
    </div>
  );
}
