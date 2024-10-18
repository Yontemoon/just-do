import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calendar/")({
  component: CalendarHeader,
});

function CalendarHeader() {
  return <nav>Temp Calendar Navbar</nav>;
}
