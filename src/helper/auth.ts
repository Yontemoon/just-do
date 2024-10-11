import { pb } from "@/lib/pocketbase";

const auth = {
  getUserId: function () {
    return (pb?.authStore?.model?.id as string) || null;
  },
  getUserInfo: function () {
    return pb.authStore.model;
  },
  isValid: function () {
    return pb.authStore.isValid;
  },
  getToken: function () {
    return pb.authStore.token;
  },
};

const authAction = {
  login: async function (email: string, password: string) {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    return authData;
  },
  logout: function () {
    pb.authStore.clear();
  },
  signUp: async function (
    email: string,
    password: string,
    passwordConfirm: string
  ) {
    return await pb
      .collection("users")
      .create({ email, password, passwordConfirm });
  },
};

export { auth, authAction };
