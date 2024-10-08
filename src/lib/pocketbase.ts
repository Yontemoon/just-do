import PocketBase from "pocketbase";

export const pb = new PocketBase("http://127.0.0.1:8090");

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
