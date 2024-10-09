import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";

export const Route = createLazyFileRoute("/signin/")({
  component: SignIn,
});

function SignIn() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div>
      <h2>Sign in form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
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
            <div>
              <label>Username</label>
              <input
                id="username"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border border-black"
              />
              {field.state.meta.errors && (
                <div className="text-red-500">{field.state.meta.errors}</div>
              )}
            </div>
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <div>
              <label>Password</label>
              <input
                id="password"
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border border-black"
              />
            </div>
          )}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
