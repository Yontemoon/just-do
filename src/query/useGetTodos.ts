import { useQuery } from "@tanstack/react-query";
import { usePocket } from "@/hooks/useAuth";
import todos from "@/helper/todos";

function useGetTodos() {
  const { user } = usePocket();
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", user?.id],
    queryFn: async () => {
      const response = await todos.list();
      return response;
    },
  });

  return { data, isLoading, error };
}

export default useGetTodos;
