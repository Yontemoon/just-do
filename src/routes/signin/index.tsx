import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Updater, useForm } from "@tanstack/react-form";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Label from "@/components/Label";
import Button from "@/components/Button";
import { authAction, auth } from "@/helper/auth";

export const Route = createFileRoute("/signin/")({
  beforeLoad: () => {
    if (auth.getUserId()) {
      throw redirect({ to: "/" });
    }
  },

  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await authAction.login(
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
