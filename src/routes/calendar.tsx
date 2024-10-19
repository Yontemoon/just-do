import { auth } from "@/helper/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

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
  return (
    <>
      <div className="mx-5 my-10 min-h-screen">
        <header>Temp header</header>
        <Outlet />
      </div>
    </>
  );
}
