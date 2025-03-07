import { useSession } from "@/hooks";
import { TCheckersPlayer } from "@khel-mitra/shared/types";
import { useOnlineCheckers } from "@/checkers/_lib/hooks";
import Image from "next/image";
import { User2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const DisplayCheckersPlayer: React.FC<{
    player?: TCheckersPlayer;
    className?: string;
}> = ({ player, className }) => {
    const { user } = useSession();
    const { room } = useOnlineCheckers();

    if (!player) return null;

    return (
        <div
            className={cn(
                className,
                "py-2 w-full flex gap-2 items-center bg-muted px-3 rounded-md",
                room?.currentPlayerId === player.id &&
                    "animate-pulse ring-2 ring-primary bg-primary/20",
            )}
        >
            <div className="bg-muted-foreground ring-2 ring-muted p-2 rounded-xl">
                {player.avatarUrl ? (
                    <Image height={100} width={100} alt={player.username} src={player.avatarUrl} />
                ) : (
                    <User2 className="size-8 text-background" />
                )}
            </div>

            <div className="flex flex-col">
                <p className={cn(player.id === user?.id ? "text-emerald-500" : "text-destructive")}>
                    {player.username}
                </p>
                <p className="text-sm text-muted-foreground">{player.color} pieces</p>
            </div>
        </div>
    );
};
