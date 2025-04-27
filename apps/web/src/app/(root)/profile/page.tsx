"use client";

import * as React from "react";
import { useSession } from "@/hooks";
import { ShowContent } from "@/components/common";

const ProfilePage: React.FC = ({}) => {
    const { user } = useSession();

    return (
        <div className="w-full py-8 px-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold tracking-wide mb-8">Profile</h1>
            {/* Profile content */}

            <ShowContent data={user}>
                {(user) => (
                    <div className="flex flex-col gap-4 w-md bg-card shadow border p-4 rounded-md">
                        <div className="flex justify-between">
                            <div>id</div>
                            <h2 className="font-semibold py-1 px-3 bg-secondary rounded-md">
                                {user.id}
                            </h2>
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <div>Username</div>
                                <h2 className="font-semibold py-1 px-3 bg-secondary rounded-md">
                                    {user.username}
                                </h2>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <div>Token</div>
                                <h2 className="font-semibold py-1 px-3 bg-secondary rounded-md">
                                    {user?.token}
                                </h2>
                            </div>
                        </div>
                    </div>
                )}
            </ShowContent>
        </div>
    );
};

export default ProfilePage;
