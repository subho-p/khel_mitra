import React from "react";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const PasswordInput: React.FC<ControllerRenderProps> = (field) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <React.Fragment>
            <div className="flex items-center justify-center gap-2 relative">
                <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder={showPassword ? "password" : "********"}
                    autoComplete="off"
                    className="pr-10"
                />
                <button
                    type="button"
                    className="absolute right-2 text-muted-foreground cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <EyeIcon className="size-5" />
                    ) : (
                        <EyeOffIcon className="size-5" />
                    )}
                </button>
            </div>
        </React.Fragment>
    );
};
