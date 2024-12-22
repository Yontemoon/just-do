import { useQuery } from "@tanstack/react-query";
import todos from "@/helper/todos";
import { auth } from "@/helper/auth";

// NO LONGER USING
// USING OPTIONS INSTEAD FOR INITIAL LOADING PAGES
function useGetTodos(
  display: "all" | "complete" | "incomplete",
  date_all: boolean,
  date: string | undefined
) {
  const userId = auth.getUserId();
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", userId, display, date, date_all],
    queryFn: async () => {
      const response = await todos.list(display, date_all, date);
      return response;
    },
  });

  return { data, isLoading, error };
}

export default useGetTodos;
