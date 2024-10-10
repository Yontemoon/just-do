import { useQuery } from "@tanstack/react-query";
import { getTodos } from "@/lib/pocketbase";
import { usePocket } from "@/hooks/useAuth";

function useGetTodos() {
  const { user } = usePocket();
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", user?.id],
    queryFn: async () => {
      const response = await getTodos();
      return response;
    },
  });

  return { data, isLoading, error };
}

export default useGetTodos;
