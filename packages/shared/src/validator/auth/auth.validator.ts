import * as z from "zod";

const email = z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" });

const password = z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(32, { message: "Password must be between 8 and 32 characters" });

export const signUpSchema = z.object({ email, password }).required();

export const signInSchema = z.object({ email, password }).required();
