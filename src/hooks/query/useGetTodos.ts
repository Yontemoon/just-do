import { useQuery } from "@tanstack/react-query";
import todos from "@/helper/todos";
import { auth } from "@/helper/auth";

function useGetTodos() {
  const userId = auth.getUserId();
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", userId],
    queryFn: async () => {
      const response = await todos.list();
      return response;
    },
  });

  return { data, isLoading, error };
}

export default useGetTodos;
