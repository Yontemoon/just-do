import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { auth } from "@/helper/auth";
import Label from "@/components/Label";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { zodValidator } from "@tanstack/zod-form-adapter";
import type { FieldMeta } from "@tanstack/react-form";
import { SignUpSchema } from "@/types/z.types";
import { authAction } from "@/helper/auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { dateUtils } from "@/helper/utils";

function FieldInfo({ fieldMeta }: { fieldMeta: FieldMeta | undefined }) {
  if (!fieldMeta) return null;

  return (
    <>
      {fieldMeta.isTouched && fieldMeta.errors.length ? (
        <p className="text-destructive text-sm mt-1">
          {fieldMeta.errors.join(",")}
        </p>
      ) : null}
      {fieldMeta.isValidating ? "Validating..." : null}
    </>
  );
}

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    if (auth.getUserId()) {
      redirect({
        to: "/",
        search: {
          display: "all",
          date: dateUtils.getToday(),
          date_all: false,
        },
      });
    }
  },
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [serverValidation, setServerValidation] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const response = await authAction.signUp(
        value.email,
        value.password,
        value.confirmPassword
      );
      if (response.status === 400) {
        setServerValidation("Email or password is incorrect.");
      } else {
        navigate({
          to: "/",
          search: {
            date: dateUtils.getToday(),
            display: "all",
            date_all: false,
          },
        });
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: SignUpSchema,
    },
  });

  return (
    <div className="w-96 mx-auto max-w-full text-center">
      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <h2>Sign Up</h2>

        <form.Field
          name="email"
          children={(field) => (
            <>
              <FormField>
                <Label>Email</Label>
                <Input
                  type="text"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
              <FieldInfo fieldMeta={field.state.meta} />
            </>
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <>
              <FormField>
                <Label>Password</Label>
                <Input
                  type="password"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
              <FieldInfo fieldMeta={field.state.meta} />
            </>
          )}
        />
        <form.Field
          name="confirmPassword"
          children={(field) => (
            <>
              <FormField>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
              <FieldInfo fieldMeta={field.state.meta} />
            </>
          )}
        />
        <span>{serverValidation}</span>
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}
