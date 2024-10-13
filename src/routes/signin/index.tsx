import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Label from "@/components/Label";
import Button from "@/components/Button";
import { authAction, auth } from "@/helper/auth";
import { useState } from "react";
import { SignInSchema } from "@/types/z.types";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FieldInfo from "@/components/FieldInfo";
import { dateUtils } from "@/helper/utils";

export const Route = createFileRoute("/signin/")({
  beforeLoad: () => {
    if (auth.getUserId()) {
      throw redirect({
        to: "/",
        search: { display: "all", date: dateUtils.getToday(), date_all: false },
      });
    }
  },

  component: SignIn,
});

function SignIn() {
  const [serverValidation, setServerValidation] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await authAction.login(values.value.email, values.value.password);

        navigate({
          to: "/",
          search: {
            display: "all",
            date: dateUtils.getToday(),
            date_all: false,
          },
        });
      } catch (error) {
        setServerValidation("Email or password is invalid.");
        console.error(error);
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: SignInSchema,
    },
  });

  return (
    <div className="w-96 m-0 mx-auto max-w-full">
      <h2 className="text-center mb-5">Sign In</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid gap-3"
      >
        <form.Field
          name="email"
          children={(field) => (
            <>
              <FormField>
                <Label>Email</Label>
                <Input
                  type="text"
                  value={field.state.value}
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
                  id="password"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
              <FieldInfo fieldMeta={field.state.meta} />
            </>
          )}
        />
        <Link to="/signup">Don't have an account?</Link>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {isSubmitting ? "Loading..." : "Login"}
            </Button>
          )}
        />

        <div className="text-center text-red-500 text-lg">
          <span>{serverValidation}</span>
        </div>
      </form>
    </div>
  );
}
