import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signin } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { signInSchema, SignInSchema } from "@khel-mitra/shared/validator";
import { useSessionStore } from "@/store/useSessionStore";
import { useNotificationStore } from "@/store/useNotificationStore";

export const useUserSignin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { fetchUserData } = useSessionStore();
    const { fetchNotifications } = useNotificationStore();

    const [successMessage, setSuccessMessage] = React.useState<string>();

    const form = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate: submitForm, error } = useMutation({
        mutationKey: ["user", "signin", "email"],
        mutationFn: signin,
        onSuccess: async () => {
            await fetchUserData();
            await fetchNotifications();
            setSuccessMessage("User signin successfully");

            form.reset();
            const callback = searchParams.get("callback");
            if (callback) {
                router.push(callback);
                return;
            }

            router.push("/");
        },
    });

    const onSubmit = (data: SignInSchema) => {
        setSuccessMessage(undefined);

        submitForm(data);
    };

    return {
        form,
        onSubmit,
        successMessage,
        errorMessage: error?.message,
    };
};
