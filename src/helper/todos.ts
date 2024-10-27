import { pb } from "@/lib/pocketbase";
import { parseDate, createSetHash } from "./utils";
import { RecordModel } from "pocketbase";
import { monthUtils } from "./utils";

export const todosByMonth = async (date: string) => {
  try {
    const startDate = monthUtils.start(date);
    const endDate = monthUtils.end(date);
    console.log(startDate, endDate);
    const todos = await pb.collection("todos").getFullList({
      filter: `date_set >= "${startDate} 00:00:00" && date_set <= "${endDate} 23:59:59"`,
    });
    return todos;
  } catch (error) {
    console.error(error);
    throw Error("Error in Todos by Month");
  }
};

const todos = {
  list: async function (
    display: "all" | "complete" | "incomplete",
    date_all: boolean,
    date?: string | undefined
  ) {
    let data = [] as RecordModel[];
    if (date_all) {
      if (display === "all") {
        data = await pb.collection("todos").getFullList({
          sort: "-created",
        });
      } else if (display === "complete") {
        data = await pb.collection("todos").getFullList({
          sort: "-created",
          filter: `is_complete = true`,
        });
      } else {
        data = await pb.collection("todos").getFullList({
          sort: "-created",
          filter: `is_complete = false`,
        });
      }
    } else {
      if (display === "all") {
        data = await pb.collection("todos").getFullList({
          sort: "-created",
          filter: `date_set >= "${date} 00:00:00" && date_set <= "${date} 23:59:59"`,
        });
      } else {
        const isComplete = display === "complete" ? true : false;
        data = await pb.collection("todos").getFullList({
          sort: "-created",
          filter: `is_complete = ${isComplete} && date_set >= "${date} 00:00:00" && date_set <= "${date} 23:59:59"`,
        });
      }
    }
    const hashSet = createSetHash(data);
    return { data, hashSet };
  },
  create: async function (todo: string, date: string, user: string) {
    const parsedDate = parseDate(date);
    const record = await pb.collection("todos").create({
      todo: todo,
      user: user,
      date_set: parsedDate,
    });
    return record;
  },
  update: {
    completion: async function (todoId: string, isComplete: boolean) {
      const record = await pb.collection("todos").update(todoId, {
        is_complete: isComplete,
      });
      return record;
    },
    todo: async function (todoId: string, todo: string, isComplete: boolean) {
      const record = await pb.collection("todos").update(todoId, {
        todo: todo,
        is_complete: isComplete,
      });
      return record;
    },
  },
  delete: async function (todoId: string) {
    const record = await pb.collection("todos").delete(todoId);
    if (record === null) return;
    else return record;
  },
  updateCompletion: async function (todoId: string, isComplete: boolean) {
    const record = await pb.collection("todos").update(todoId, {
      is_complete: isComplete,
    });
    return record;
  },
  undo: async (originalTodo: RecordModel) => {
    const record = await pb.collection("todos").create(originalTodo);
    return record;
  },
};

export const filterTodosCalendar = (todos: RecordModel[]) => {
  const groupedTodos = todos.reduce<Record<string, RecordModel[]>>(
    (acc, todo) => {
      if (!acc[todo.date_set]) {
        acc[todo.date_set] = [];
      }

      if (acc[todo.date_set].length < 5) {
        acc[todo.date_set].push(todo);
      }
      return acc;
    },
    {}
  );

  return groupedTodos;
};

export const convertCalendarEvents = (todos: Record<string, RecordModel[]>) => {
  return Object.values(todos).flatMap((todoList) =>
    todoList.map((event) => ({
      title: event.todo,
      date: event.date_set,
      recordModel: event,
    }))
  );
};

export default todos;
