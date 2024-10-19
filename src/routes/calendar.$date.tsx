import { todosQueryOptions } from "@/hooks/options/todosQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import Button from "@/components/Button";
import { useRef } from "react";
import { monthUtils } from "@/helper/utils";
import Loader from "@/components/Loader";

export const Route = createFileRoute("/calendar/$date")({
  component: CalendarComponent,
  loader: ({ context: { queryClient }, params: { date } }) => {
    return queryClient.ensureQueryData(todosQueryOptions(date));
  },
});

function CalendarComponent() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const dateParams = Route.useParams().date;
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: todos, isLoading } = useSuspenseQuery(
    todosQueryOptions(dateParams)
  );

  function handleDateClick(dateInfo: DateClickArg) {
    console.log(dateInfo);
  }

  const handleGoNext = () => {
    const calendarApi = calendarRef?.current?.getApi();
    navigate({
      params: (prev) => {
        return { ...prev, date: monthUtils.next(prev.date) };
      },
    });
    calendarApi?.next();
  };

  const handleGoPrev = () => {
    const calendarApi = calendarRef?.current?.getApi();
    navigate({
      params: (prev) => {
        return { ...prev, date: monthUtils.prev(prev.date) };
      },
    });
    calendarApi?.prev();
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {" "}
      <Button onClick={handleGoPrev}>Go Back</Button>
      <Button onClick={handleGoNext}>Go Forward</Button>
      <FullCalendar
        headerToolbar={false}
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={todos.map((todo) => {
          return { title: todo.todo, date: todo.date_set };
        })}
        dateClick={handleDateClick}
      />
    </div>
  );
}
