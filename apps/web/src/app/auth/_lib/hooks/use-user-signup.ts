import React from "react";
import { ACCESS_TOKEN_NAMESPACE } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signup } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpSchema, SignUpSchema } from "@khel-mitra/shared/validator";

export const useUserSignup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

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
        onSuccess: (data) => {
            setSuccessMessage("User signup successfully");
            localStorage.setItem(ACCESS_TOKEN_NAMESPACE, data?.accessToken);
            form.reset();

            queryClient.invalidateQueries({ queryKey: ["user", "me"] });

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
