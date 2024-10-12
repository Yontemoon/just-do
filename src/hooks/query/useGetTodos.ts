import { useQuery } from "@tanstack/react-query";
import todos from "@/helper/todos";
import { auth } from "@/helper/auth";

function useGetTodos(filter: "all" | "complete" | "incomplete") {
  const userId = auth.getUserId();
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", userId, filter],
    queryFn: async () => {
      const response = await todos.list(filter);
      return response;
    },
  });

  return { data, isLoading, error };
}

export default useGetTodos;
