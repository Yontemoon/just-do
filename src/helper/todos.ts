import { pb } from "@/lib/pocketbase";
import { parseDate } from "./utils";

const todos = {
  list: async function (
    display: "all" | "complete" | "incomplete",
    date_all: boolean,
    date?: string | undefined
  ) {
    if (date_all) {
      if (display === "all") {
        return pb.collection("todos").getFullList({
          sort: "-created",
        });
      } else if (display === "complete") {
        return pb.collection("todos").getFullList({
          sort: "-created",
          filter: `is_complete = true`,
        });
      } else {
        return pb.collection("todos").getFullList({
          sort: "-created",
          filter: `is_complete = false`,
        });
      }
    }

    if (display === "all") {
      return pb.collection("todos").getFullList({
        sort: "-created",
        filter: `date_set >= "${date} 00:00:00" && date_set <= "${date} 23:59:59"`,
      });
    } else {
      const isComplete = display === "complete" ? true : false;
      return pb.collection("todos").getFullList({
        sort: "-created",
        filter: `is_complete = ${isComplete} && date_set >= "${date} 00:00:00" && date_set <= "${date} 23:59:59"`,
      });
    }
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
    todo: async function (todoId: string, todo: string) {
      const record = await pb.collection("todos").update(todoId, {
        todo: todo,
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
};

export default todos;
