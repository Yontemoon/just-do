import { auth } from "@/helper/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

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
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={[{ title: "event 1", date: new Date() }]}
        />
      </div>
    </>
  );
}
