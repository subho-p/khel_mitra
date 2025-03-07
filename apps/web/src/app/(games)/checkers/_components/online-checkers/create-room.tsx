import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { checkersSocketClient } from "@/lib/socket";
import { useSocketListener } from "@/hooks/use-socket-listen";
import { GAME_EVENT } from "@khel-mitra/shared/namespace/socket";
import { toast } from "@/hooks";

export const CreateRoom = () => {
    const { data } = useSocketListener(checkersSocketClient, GAME_EVENT.CREATE_ROOM);

    if (!data) {
        console.log(data);
        return <div>Creating Room...</div>;
    }

    const copyRoomCode = () => {
        navigator.clipboard.writeText(data?.roomCode);

        
        const input = document.getElementById("roomCode") as HTMLInputElement
        // select one by one 
        input.select();
        
        toast({ description: "Room Code copied", duration: 2000 });

        setTimeout(() => {
            input.blur();
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center py-6 min-h-[40svh]">
            <div className="flex flex-col max-w-md">
                <div>
                    <Label className="text-base">Room Code:</Label>
                </div>
                <div className="flex gap-4">
                    <div>
                        <Input
                            id="roomCode"
                            type="text"
                            readOnly
                            value={data?.roomCode}
                            autoFocus
                            aria-description="Room Code"
                        />
                        <p className="text-sm text-muted py-1">
                            To invite players, share this room code with them. They will need to
                            join the same room code to start playing.
                        </p>
                    </div>
                    <Button onClick={copyRoomCode}>Copy code</Button>
                </div>
            </div>
        </div>
    );
};
