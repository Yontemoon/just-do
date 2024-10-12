import { pb } from "@/lib/pocketbase";

const todos = {
  list: async function (filter: "all" | "complete" | "incomplete") {
    if (filter === "all") {
      return pb.collection("todos").getFullList({
        sort: "-created",
      });
    } else {
      const isComplete = filter === "complete" ? true : false;
      return pb.collection("todos").getFullList({
        sort: "-created",
        filter: `is_complete = ${isComplete}`,
      });
    }
  },
  create: async function (todo: string, user: string) {
    const record = await pb.collection("todos").create({
      todo: todo,
      user: user,
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
