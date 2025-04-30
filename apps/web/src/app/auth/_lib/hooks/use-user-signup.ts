import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signup } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { signUpSchema, SignUpSchema } from "@khel-mitra/shared/validator";
import { useSessionStore } from "@/store/useSessionStore";
import { useNotificationStore } from "@/store/useNotificationStore";

export const useUserSignup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { fetchUserData } = useSessionStore();
    const { fetchNotifications } = useNotificationStore();

    const [successMessage, setSuccessMessage] = React.useState<string>();

    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate: submitForm, error } = useMutation({
        mutationKey: ["user", "signup", "email"],
        mutationFn: signup,
        onSuccess: async () => {
            await fetchUserData();
            await fetchNotifications();
            setSuccessMessage("User signup successfully");
            form.reset();

            const callback = searchParams.get("callback");
            if (callback) {
                router.push(callback);
                return;
            }

            router.push("/");
        },
    });

    const onSubmit = (data: SignUpSchema) => {
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
