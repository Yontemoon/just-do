import { createLazyFileRoute } from "@tanstack/react-router";
import useGetTodos from "../query/useGetTodos";
export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data: todos, isLoading } = useGetTodos();
  console.log(todos);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="underline">
      {todos?.map((todo) => <li key={todo.id}>{todo.todo}</li>)}
    </ul>
  );
}
