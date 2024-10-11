import { pb } from "@/lib/pocketbase";

const todos = {
  list: async function () {
    const record = await pb.collection("todos").getFullList({
      sort: "-created",
    });

    return record;
  },
  create: async function (todo: string, user: string) {
    const record = await pb.collection("todos").create({
      todo: todo,
      user: user,
    });
    return record;
  },
  update: async function (todoId: string, todo: string) {
    const record = await pb.collection("todos").update(todoId, {
      todo: todo,
    });
    return record;
  },

  delete: async function (todoId: string) {
    const record = await pb.collection("todos").delete(todoId);
    if (record === null) return;
    else return record;
  },
};

export default todos;
