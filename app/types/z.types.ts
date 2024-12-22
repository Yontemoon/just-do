import { dateUtils } from "@/helper/utils";
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

const HomePageSPSchema = z
  .object({
    display: z.enum(["all", "complete", "incomplete"]).catch("all"),
    date_all: z.boolean().catch(() => false),
    date: z.string().optional().default(dateUtils.getToday()),
    hashtag: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.date_all) {
        return true;
      }
      return !!data.date;
    },
    {
      message: "Date is required when date_all is false",
      path: ["date"],
    }
  )
  .transform((data) => ({
    ...data,
    date: data.date_all ? undefined : data.date || dateUtils.getToday(),
  }));

export { SignUpSchema, SignInSchema, addTodoSchema, HomePageSPSchema };
