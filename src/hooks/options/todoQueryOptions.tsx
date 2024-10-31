import { queryOptions } from "@tanstack/react-query";
import todos from "@/helper/todos";

const todoQueryOptions = (
  display: "all" | "complete" | "incomplete",
  date_all: boolean,
  date: string | undefined
) => {
  return queryOptions({
    queryKey: ["todos", display, date, date_all],
    queryFn: async () => {
      const response = await todos.list(display, date_all, date);
      return response;
    },
  });
};

export { todoQueryOptions };
