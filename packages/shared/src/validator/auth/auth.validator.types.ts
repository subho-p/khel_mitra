import z from "zod";
import { signUpSchema, signInSchema } from "./auth.validator";

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
