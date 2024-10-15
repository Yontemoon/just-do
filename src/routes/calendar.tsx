import { auth } from "@/helper/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/calendar")({
  beforeLoad: () => {
    if (!auth.getUserId()) {
      throw redirect({
        to: "/signin",
      });
    }
  },

  component: Calendar,
});

function Calendar() {
  return <>Hello /calendar!</>;
}
