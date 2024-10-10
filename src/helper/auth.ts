import { pb } from "@/lib/pocketbase";

function getUserId() {
  return (pb?.authStore?.model?.id as string) || null;
}

export { getUserId };
