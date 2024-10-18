import { queryOptions } from "@tanstack/react-query";
import { todosByMonth } from "@/helper/todos";

const todosQueryOptions = (date: string) => {
  return queryOptions({
    queryKey: ["todos", { date }],
    queryFn: () => todosByMonth(date),
  });
};

export { todosQueryOptions };
