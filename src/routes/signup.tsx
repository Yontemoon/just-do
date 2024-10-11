import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { auth } from "@/helper/auth";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    if (auth.getUserId()) {
      redirect({ to: "/" });
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
