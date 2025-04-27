import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex w-full h-[80vh] justify-center items-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
