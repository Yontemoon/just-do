import { createFileRoute, redirect } from "@tanstack/react-router";
import useGetTodos from "../query/useGetTodos";
import { useForm } from "@tanstack/react-form";
import { pb } from "../lib/pocketbase";
import { usePocket } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/signin",
      });
    }
  },
  component: HomePage,
});

function HomePage() {
  const { data: todos, isLoading, error } = useGetTodos();
  const queryClient = useQueryClient();

  const { user } = usePocket();
  const form = useForm({
    defaultValues: {
      todo: "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (user && user.id) {
          const response = await pb.collection("todos").create({
            todo: value.todo,
            user: user.id,
          });
          if (response) {
            queryClient.invalidateQueries({ queryKey: ["todos", user.id] });
          }
          return response;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
  });

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
          form.reset();
        }}
      >
        <form.Field
          name="todo"
          // validators={}
          children={(field) => {
            return (
              <>
                <label htmlFor={field.name}>Todo: </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {/* <FieldInfo field={field} /> */}
              </>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitted]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          )}
        />
      </form>
      <ul className="underline">
        {todos?.map((todo) => (
          <li key={todo.id}>
            {todo.todo} -- {todo.created}
          </li>
        ))}
      </ul>
    </>
  );
}
