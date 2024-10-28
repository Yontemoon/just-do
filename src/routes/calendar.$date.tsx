import { todosQueryOptions } from "@/hooks/options/todosQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import Button from "@/components/Button";
import { useRef } from "react";
import {
  dateToYYYYMM,
  dateToYYYYMMdd,
  monthUtils,
  parseDateYYYYMM,
} from "@/helper/utils";
import Loader from "@/components/Loader";
import { useDialogStore } from "@/store/useDialogStore";
import DialogAddTodo from "@/components/dialogs/DialogAddTodo";
import { filterTodosCalendar, convertCalendarEvents } from "@/helper/todos";
import { EventClickArg } from "@fullcalendar/core/index.js";
import DialogEditTodo from "@/components/dialogs/DialogEditTodo";
import { RecordModel } from "pocketbase";
import { format } from "date-fns";
import clsx from "clsx";

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

  const todosInfo = generateDateInfo(todos);
  const filteredTodos = filterTodosCalendar(todos);
  const eventTodos = convertCalendarEvents(filteredTodos);

  const handleDateClick = (dateInfo: DateClickArg) => {
    const target = dateInfo?.jsEvent.target as HTMLElement;
    if (target.id) return;
    openDialog(DialogAddTodo, { date: dateInfo.dateStr });
  };

  const handleEventClick = (eventInfo: EventClickArg) => {
    openDialog(DialogEditTodo, {
      todo: eventInfo.event._def.extendedProps.recordModel,
    });
  };

  const handleGoNext = () => {
    const calendarApi = calendarRef?.current?.getApi();
    calendarApi?.next();

    navigate({
      params: (prev) => {
        return { ...prev, date: monthUtils.next(prev.date) };
      },
    });
  };

  const handleGoPrev = () => {
    const calendarApi = calendarRef?.current?.getApi();
    calendarApi?.prev();

    navigate({
      params: (prev) => {
        return { ...prev, date: monthUtils.prev(prev.date) };
      },
    });
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="flex justify-end gap-4 mb-3">
        <Button onClick={handleGoPrev}>Go Back</Button>
        <Button onClick={handleGoNext}>Go Forward</Button>
      </div>
      <FullCalendar
        initialDate={parseDateYYYYMM(dateParams)}
        headerToolbar={false}
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={eventTodos}
        dateClick={handleDateClick}
        dayHeaders={true}
        eventClick={handleEventClick}
        // eventClassNames={clsx(
        //   "hover:cursor-pointer",
        //   eventTodos.find((todo) => {
        //     return todo.recordModel.is_complete === true;
        //   }) && "line-through"
        // )}
        eventContent={(args) => {
          const isComplete =
            args.event._def.extendedProps.recordModel?.is_complete;
          return (
            <div className="flex m-1 font-semibold text-nowrap max-w-full overflow-hidden whitespace-nowrap ">
              <span className={clsx(isComplete && "line-through")}>
                {args.event.title}
              </span>
            </div>
          );
        }}
        eventClassNames={(args) => {
          const isComplete =
            args.event._def.extendedProps.recordModel?.is_complete;
          return clsx("hover:cursor-pointer", isComplete && "line-through");
        }}
        dayCellClassNames={
          "hover:cursor-pointer hover:bg-gray-100 relative z-10"
        }
        displayEventTime={false}
        dayCellContent={(dayCellInfo) => {
          const dayInfo = todosInfo.get(dayCellInfo.dayNumberText);
          return (
            <div>
              <Link
                to="/"
                search={{
                  date: dateToYYYYMMdd(dayCellInfo.date),
                  display: "all",
                  date_all: false,
                }}
                params={{ date: dateToYYYYMM(dayCellInfo.date) }}
                id={dateToYYYYMM(dayCellInfo.date)}
                className="z-30 relative hover:underline "
              >
                {dayCellInfo.dayNumberText}
              </Link>
              {dayInfo && <div>
                <span>{dayInfo.count || 0}</span>{" "}
                <span>
                  {
                    Math.floor(
                        (Math.round(
                          (dayInfo.percent_complete / dayInfo.count) * 100
                        ) /
                          100) *
                          100
                      )
                    || 0}
                  %
                </span>
              </div>}
            </div>
          );
        }}
      />
    </div>
  );
}

const generateDateInfo = (todos: RecordModel[]) => {
  const dateMap = new Map();

  todos.map((todo) => {
    const day = format(todo.date_set, "d");

    const currentEntry = dateMap.get(day);
    const currentCount = currentEntry ? currentEntry.count : 0;
    const completionCount = currentEntry ? currentEntry.percent_complete : 0;
    const isComplete = todo.is_complete;
    dateMap.set(day, {
      count: currentCount + 1,
      percent_complete: isComplete ? completionCount + 1 : completionCount,
    });
  });

  return dateMap;
};
