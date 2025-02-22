"use client";

import * as React from "react";
import Link from "next/link";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormErrorMessage, FormSuccessMessage } from "@/components/common";

import { useUserSignin } from "../_lib/hooks";
import { PasswordInput } from "./password-input";
import { CardDescription } from "@/components/ui/card";

export const SigninForm: React.FC = () => {
    const { form, onSubmit, errorMessage, successMessage } = useUserSignin();

    return (
        <React.Fragment>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="khelmitra@test.com"
                                        autoFocus
                                        autoComplete="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormErrorMessage error={errorMessage} />
                    <FormSuccessMessage message={successMessage} />
                    <Button className="w-full mt-4" type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
            <div className="w-full flex flex-col">
                <div className="w-full flex items-end justify-end">
                    <Button variant="link" className="text-xs text-end">
                        Forgot your password?
                    </Button>
                </div>
                <div className="flex w-full items-center justify-center text-center mt-2 gap-1">
                    <CardDescription>
                        Don&apos;t have an account?{" "}
                    </CardDescription>
                    <Button variant="link" asChild className="m-0 p-0">
                        <Link href="/auth/signup">Sign up</Link>
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};
