"use client";

import * as React from "react";
import { useSession } from "@/hooks";
import { ShowContent } from "@/components/common";

const ProfilePage: React.FC = ({}) => {
    const { user } = useSession();

    return (
        <div className="w-full py-8 px-4">
            <h1>Profile</h1>
            {/* Profile content */}

            <ShowContent data={user}>
                {(user) => (
                    <div>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </div>
                )}
            </ShowContent>
        </div>
    );
};

export default ProfilePage;
