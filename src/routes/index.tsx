import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import useGetTodos from "@/hooks/query/useGetTodos";
import { useForm } from "@tanstack/react-form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { auth } from "@/helper/auth";
import todos from "@/helper/todos";
import useInvalidateQueries from "@/hooks/useInvalidateQueries";
import { addTodoSchema, HomePageSPSchema } from "@/types/z.types";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FieldInfo from "@/components/FieldInfo";
import { dateUtils } from "@/helper/utils";
import Loader from "@/components/Loader";
import Switch from "@/components/Switch";
import AddIcon from "@/components/icons/AddIcon";
import TodoTable from "@/components/TodoTable";

export const Route = createFileRoute("/")({
  validateSearch: HomePageSPSchema,
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
  const {
    data: todosInfo,
    isLoading,
    error,
  } = useGetTodos(display, date_all, date);

  const invalidateQueries = useInvalidateQueries();

  function handleYesterday() {
    navigate({
      search: (prev) => ({
        ...prev,
        date: dateUtils.getYesterday(prev.date as string),
      }),
    });
  }

  function handleToday() {
    navigate({
      search: (prev) => ({
        ...prev,
        date: dateUtils.getToday(),
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
    <div className="max-w-3xl m-auto">
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
          {date !== dateUtils.getToday() && (
            <Button onClick={handleToday}>Today</Button>
          )}
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
                    autoFocus
                    autoComplete="off"
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
                {isSubmitting ? "Adding..." : <AddIcon />}
              </Button>
            )}
          />
        </div>
      </form>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ul className="flex flex-wrap gap-3 mb-4">
            {todosInfo?.hashSet.map((hash, index) => (
              <li key={index}>#{hash}</li>
            ))}
          </ul>
          {todosInfo?.data && <TodoTable tableData={todosInfo?.data} />}
        </>
      )}
    </div>
  );
}
