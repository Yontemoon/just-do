import { createLazyFileRoute } from "@tanstack/react-router";
import useGetTodos from "../query/useGetTodos";
export const Route = createLazyFileRoute("/")({
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
