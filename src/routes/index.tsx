import { createFileRoute, redirect } from "@tanstack/react-router";
import useGetTodos from "../query/useGetTodos";
export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/signin",
        // search
      });
    }
  },
  component: HomePage,
});

function HomePage() {
  const { data: todos, isLoading, error } = useGetTodos();

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form>
        <input />
        <button>Add</button>
      </form>
      <ul className="underline">
        {todos?.map((todo) => <li key={todo.id}>{todo.todo}</li>)}
      </ul>
    </>
  );
}
