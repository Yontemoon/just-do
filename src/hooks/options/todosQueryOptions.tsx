import { queryOptions } from "@tanstack/react-query";
import { todosByMonth } from "@/helper/todos";

const todosQueryOptions = (yearMonth: string) => {
  return queryOptions({
    queryKey: ["calendar-todos", yearMonth],
    queryFn: () => todosByMonth(yearMonth),
  });
};

export { todosQueryOptions };
