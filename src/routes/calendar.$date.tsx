import { todosQueryOptions } from "@/hooks/options/todosQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import Button from "@/components/Button";
import { useMemo, useRef } from "react";
import { monthUtils } from "@/helper/utils";
import Loader from "@/components/Loader";
import { useDialogStore } from "@/store/useDialogStore";
import DialogAddTodo from "@/components/dialogs/DialogAddTodo";
import { filterTodosCalendar, convertCalendarEvents } from "@/helper/todos";
import { EventClickArg } from "@fullcalendar/core/index.js";
import DialogEditTodo from "@/components/dialogs/DialogEditTodo";

export const Route = createFileRoute("/calendar/$date")({
  component: CalendarComponent,
  loader: ({ context: { queryClient }, params: { date } }) => {
    return queryClient.ensureQueryData(todosQueryOptions(date));
  },
});

function CalendarComponent() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const { openDialog } = useDialogStore();
  const dateParams = Route.useParams().date;
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: todos, isLoading } = useSuspenseQuery(
    todosQueryOptions(dateParams)
  );
  const filteredTodos = useMemo(() => filterTodosCalendar(todos), [todos]);
  const eventTodos = useMemo(
    () => convertCalendarEvents(filteredTodos),
    [filteredTodos]
  );

  const handleDateClick = (dateInfo: DateClickArg) => {
    console.log(dateInfo);
    openDialog(DialogAddTodo);
  };

  const handleEventClick = (eventInfo: EventClickArg) => {
    console.log(eventInfo);
    openDialog(DialogEditTodo, {
      todo: eventInfo.event._def.extendedProps.recordModel,
    });
  };

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
        events={eventTodos}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventClassNames={"hover:cursor-pointer"}
        dayCellClassNames={"hover:cursor-pointer hover:bg-gray-100"}
      />
    </div>
  );
}
