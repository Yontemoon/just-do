import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../lib/pocketbase";

function useGetTodos() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await getTodos();
      return response;
    },
  });

  return { data, isLoading, error };
}

export default useGetTodos;
