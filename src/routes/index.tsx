import { createFileRoute, redirect } from "@tanstack/react-router";
import useGetTodos from "../query/useGetTodos";
import { useForm } from "@tanstack/react-form";
import { pb } from "../lib/pocketbase";
import { usePocket } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const user = pb.authStore.model?.id;
    if (!user) {
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
  console.log(user);
  const form = useForm({
    defaultValues: {
      todo: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const currentUser = pb?.authStore?.model?.id;
        console.log(currentUser);
        if (currentUser) {
          console.log("user is loggged", user);

          const response = await pb.collection("todos").create({
            todo: value.todo,
            user: currentUser,
          });
          if (response) {
            queryClient.invalidateQueries({ queryKey: ["todos", currentUser] });
          }
          return response;
        } else {
          console.log("no user");
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
    <main className="max-w-3xl m-auto">
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
                <Label htmlFor={field.name}>Todo: </Label>
                <Input
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
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
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
    </main>
  );
}
