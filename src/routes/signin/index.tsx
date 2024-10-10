import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Updater, useForm } from "@tanstack/react-form";
import { usePocket } from "../../hooks/useAuth";
import { useEffect } from "react";
import Input from "../../components/Input";
import FormField from "../../components/FormField";
import Label from "../../components/Label";
import Button from "../../components/Button";

export const Route = createFileRoute("/signin/")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/" });
    }
  },

  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { login, user } = usePocket();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await login(
          values.value.username,
          values.value.password
        );
        console.log(response);
        if (response) {
          navigate({ to: "/" });
        }
        navigate({ to: "/" });
      } catch (error) {
        console.error(error);
      }
    },
  });

  // useEffect(() => {
  //   if (user) {
  //     console.log("passing in useeffect");
  //     navigate({ to: "/" });
  //   }
  // }, [user, navigate]);

  return (
    <div className="w-96 m-0 mx-auto max-w-full">
      <h2 className="text-center mb-5">Sign In</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid gap-3"
      >
        <form.Field
          name="username"
          validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: ({ value }) => {
              if (value.length < 3) {
                return "Username must be at least 3 characters long.";
              }
            },
          }}
          children={(field) => (
            <>
              <FormField>
                <Label>Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={field.state.value}
                  onChange={(e: { target: { value: Updater<string> } }) =>
                    field.handleChange(e.target.value)
                  }
                />
              </FormField>
              {field.state.meta.errors && (
                <div className="text-red-500">{field.state.meta.errors}</div>
              )}
            </>
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <FormField>
              <Label>Password</Label>
              <Input
                id="password"
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FormField>
          )}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
