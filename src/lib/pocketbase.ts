import PocketBase from "pocketbase";

export const pb = new PocketBase(import.meta.env.VITE_PB_BASE_URL);

async function getTodos() {
  const record = await pb.collection("todos").getFullList({
    sort: "-created",
  });

  return record;
}

async function userLogin(email: string, password: string) {
  const authData = await pb
    .collection("users")
    .authWithPassword(email, password);

  return authData;
}

export { getTodos, userLogin };
