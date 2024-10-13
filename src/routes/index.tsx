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
import { dateUtils } from "@/helper/utils";
import Loader from "@/components/Loader";
import Switch from "@/components/Switch";

const searchParamsSchema = z
  .object({
    display: z.enum(["all", "complete", "incomplete"]).catch("all"),
    date_all: z.boolean().catch(() => false),
    date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.date_all) {
        return true;
      }
      return !!data.date;
    },
    {
      message: "Date is required when date_all is false",
      path: ["date"],
    }
  )
  .transform((data) => ({
    ...data,
    date: data.date_all ? undefined : data.date || dateUtils.getToday(),
  }));
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
  const { display, date, date_all } = Route.useSearch();
  console.log(display, date, date_all);

  const {
    data: todosList,
    isLoading,
    error,
  } = useGetTodos(display, date_all, date);
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
      search: (prev) => ({
        ...prev,
        date: dateUtils.getYesterday(prev.date as string),
      }),
    });
  }

  function handleTomorrow() {
    navigate({
      search: (prev) => ({
        ...prev,
        date: dateUtils.getTomorrow(prev.date as string),
      }),
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

        if (currentUser) {
          const response = await todos.create(
            value.todo,
            date || dateUtils.getToday(),
            currentUser
          );
          if (response) {
            invalidateQueries("todos", currentUser);
          }
          return response;
        } else {
          navigate({ to: "/signin" });
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

  return (
    <main className="max-w-3xl m-auto">
      <p>{date}</p>
      <div className="flex justify-between">
        <div>
          <Label>Filter</Label>
          <select
            value={display}
            onChange={(e) => {
              // BAD SOLUTION BUT..
              const newValue = e.target.value as
                | "all"
                | "complete"
                | "incomplete";

              navigate({
                search: (prev) => ({ ...prev, display: newValue }),
              });
            }}
          >
            <option value="all">Show All</option>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <Switch
          checked={date_all}
          onChange={(checked) => {
            navigate({
              search: (prev) => ({
                ...prev,
                date_all: checked,
                date: checked ? undefined : dateUtils.getToday(),
              }),
            });
          }}
        />
      </div>

      {!date_all && (
        <>
          <Button onClick={handleYesterday}>Yesterday</Button>
          <Button onClick={handleTomorrow}>Tomorrow</Button>
        </>
      )}

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
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="">
          {!todosList || todosList.length === 0 ? (
            <div>Nothing in your list...</div>
          ) : (
            todosList?.map((todo) => (
              <div className="flex justify-between mb-2 " key={todo.id}>
                <li
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
                <Button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="z-50"
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </ul>
      )}
    </main>
  );
}
