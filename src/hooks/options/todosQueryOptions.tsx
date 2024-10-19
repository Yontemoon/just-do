import { queryOptions } from "@tanstack/react-query";
import { todosByMonth } from "@/helper/todos";

const todosQueryOptions = (date: string) => {
  return queryOptions({
    queryKey: ["calendar-todos"],
    queryFn: () => todosByMonth(date),
  });
};

export { todosQueryOptions };
