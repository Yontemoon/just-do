import { createFileRoute, redirect } from "@tanstack/react-router";
import { auth } from "@/helper/auth";

export const Route = createFileRoute("/stats")({
  beforeLoad: () => {
    const userId = auth.getUserId();

    if (!userId) {
      throw redirect({
        to: "/signin",
      });
    }
  },
  component: Stats,
});

function Stats() {
  return <>Hello World</>;
}
