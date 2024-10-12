import { z } from "zod";

const SignUpSchema = z
  .object({
    email: z.string().min(3, "Username must contain at least 3 characters"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must contain at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

const SignInSchema = z.object({
  email: z.string().min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});

const addTodoSchema = z.object({
  todo: z.string().min(1, "Requires at least something!"),
});

export { SignUpSchema, SignInSchema, addTodoSchema };
