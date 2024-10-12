import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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
import { addTodoSchema } from "@/types/z.types";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FieldInfo from "@/components/FieldInfo";
import clsx from "clsx";
import { z } from "zod";
import { date } from "@/helper/utils";

const searchParamsSchema = z.object({
  display: z.enum(["all", "complete", "incomplete"]).catch("all"),
  date: z.string().catch(() => {
    const today = date.getToday();
    return today;
  }),
});

// type searchParams = z.infer<typeof searchParamsSchema>;

export const Route = createFileRoute("/")({
  validateSearch: searchParamsSchema,
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
  const { display, date } = Route.useSearch();

  const { data: todosList, isLoading, error } = useGetTodos(display);
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

  async function handleTodoComplete(todo: RecordModel, isComplete: boolean) {
    const userId = auth.getUserId();
    if (userId) {
      await todos.update.completion(todo.id, isComplete);
      invalidateQueries("todos", userId);
    }
  }

  function handleYesterday() {
    navigate({
      search: (prev) => ({ ...prev, date: date.getYesterday(prev.date) }),
    });
  }

  function handleTomorrow() {
    navigate({
      search: (prev) => ({ ...prev, date: date.getTomorrow(prev.date) }),
    });
  }
  const navigate = useNavigate({ from: Route.fullPath });
  const form = useForm({
    defaultValues: {
      todo: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChangeAsync: addTodoSchema,
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
      <select
        value={display}
        onChange={(e) => {
          // BAD SOLUTION BUT..
          const newValue = e.target.value as "all" | "complete" | "incomplete";

          navigate({
            search: (prev) => ({ ...prev, display: newValue }),
          });
        }}
      >
        <option value="all">Show All</option>
        <option value="incomplete">Incomplete</option>
        <option value="complete">Complete</option>
      </select>
      <Button onClick={handleYesterday}>Yesterday</Button>
      <Button onClick={handleTomorrow}>Tomorrow</Button>
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
            children={(field) => {
              return (
                <>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo fieldMeta={field.state.meta} />
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

      <ul className="">
        {todosList?.map((todo) => (
          <div className="flex justify-between mb-2 ">
            <li
              key={todo.id}
              className="hover:cursor-pointer hover:text-secondary z-0 hover:bg-gray-200 w-full"
              onClick={() => handleOpenDialog(todo)}
            >
              <span
                className={clsx(todo.is_complete && "line-through", "z-10")}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTodoComplete(todo, !todo.is_complete);
                }}
              >
                {todo.todo} -- {todo.created}{" "}
              </span>
            </li>
            <Button onClick={() => handleDeleteTodo(todo.id)} className="z-50">
              Delete
            </Button>
          </div>
        ))}
      </ul>
    </main>
  );
}
