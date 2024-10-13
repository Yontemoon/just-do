import { pb } from "@/lib/pocketbase";

const todos = {
  list: async function (
    display: "all" | "complete" | "incomplete",
    date_all: boolean,
    date?: string | undefined
  ) {
    if (date_all) {
      return pb.collection("todos").getFullList({
        sort: "-date_set",
      });
    } else if (display === "all") {
      return pb.collection("todos").getFullList({
        sort: "-date_set",
        filter: `date_set >= "${date} 00:00:00" && date_set <= "${date} 23:59:59"`,
      });
    } else {
      const isComplete = display === "complete" ? false : true;
      return pb.collection("todos").getFullList({
        sort: "-date_set",
        filter: `is_complete = ${isComplete}`,
      });
    }
  },
  create: async function (todo: string, date: string, user: string) {
    const record = await pb.collection("todos").create({
      todo: todo,
      user: user,
      date_set: date,
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
