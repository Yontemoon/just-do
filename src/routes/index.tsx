import { createFileRoute, redirect } from "@tanstack/react-router";
import useGetTodos from "@/hooks/query/useGetTodos";
import { useForm } from "@tanstack/react-form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import DialogEditTodo from "@/components/dialogs/DialogEditTodo";
import { useDialogStore } from "@/store/useDialogStore";
import { RecordModel } from "pocketbase";
import DialogConfirmDeleteTodo from "@/components/dialogs/DialogConfirmDeleteTodo";
import { auth } from "@/helper/auth";
import todos from "@/helper/todos";
import useInvalidateQueries from "@/hooks/useInvalidateQueries";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const user = auth.getUserId();
    if (!user) {
      throw redirect({
        to: "/signin",
      });
    }
  },
  component: HomePage,
});

function HomePage() {
  const { data: todosList, isLoading, error } = useGetTodos();

  const {
    dialogComponent: DialogComponent,
    dialogProps,
    openDialog,
  } = useDialogStore();
  const invalidateQueries = useInvalidateQueries();

  function handleOpenDialog(todo: RecordModel) {
    openDialog(DialogEditTodo, { todo });
  }

  function handleDeleteTodo(todoId: string) {
    openDialog(DialogConfirmDeleteTodo, { todoId });
  }

  const form = useForm({
    defaultValues: {
      todo: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const currentUser = auth.getUserId();
        console.log(currentUser);
        if (currentUser) {
          const response = await todos.create(value.todo, currentUser);
          if (response) {
            invalidateQueries("todos", currentUser);
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
        className="mb-5"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
          form.reset();
        }}
      >
        <Label>Todo: </Label>
        <div className="flex gap-2">
          <form.Field
            name="todo"
            // validators={}
            children={(field) => {
              return (
                <>
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
        </div>
      </form>

      {DialogComponent && <DialogComponent {...dialogProps} />}

      <ul className="underline">
        {todosList?.map((todo) => (
          <li
            key={todo.id}
            className="hover:cursor-pointer hover:text-secondary flex mb-2 justify-between"
          >
            <p onClick={() => handleOpenDialog(todo)} id="modal-trigger">
              {todo.todo} -- {todo.created}{" "}
            </p>
            <Button onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
