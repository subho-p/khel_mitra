"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import * as React from "react";

export const AuthCardWrapper: React.FC<{
    children: React.ReactNode;
    headerText: string;
}> = ({ children, headerText }) => {
    return (
        <div className="container w-full mx-auto min-h-[80svh] flex flex-col items-center justify-center">
            <Card className="w-full md:max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Khel Mitra</CardTitle>
                    <p className="text-sm">{headerText}</p>
                </CardHeader>
                <CardContent>
                    <div className="flex-grow">{children}</div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <p className="relative w-full text-sm text-center before:absolute before:top-1/2 before:left-0 before:w-5/12 before:border-t before:border-muted-foreground after:absolute after:top-1/2 after:right-0 after:w-5/12 after:border-t after:border-muted-foreground">
                        Or
                    </p>
                    <Button className="w-full" variant="secondary">
                        Login with Google
                    </Button>
                    <Button className="w-full" variant="secondary">
                        Login with GitHub
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
