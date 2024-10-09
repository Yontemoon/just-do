import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/" });
    }
  },
  component: SignUp,
});

function SignUp() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <div>
      <form>
        {/* <form.Field name="username" />
        <form.Field name="username" />
        <form.Field name="username" /> */}
      </form>
    </div>
  );
}
