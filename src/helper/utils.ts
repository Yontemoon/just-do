import { format, addDays, subDays, parse } from "date-fns";

const parseDate = (dateString: string): Date => {
  return parse(dateString, "yyyy-MM-dd", new Date());
};

const dateUtils = {
  getToday: (): string => format(new Date(), "yyyy-MM-dd"),
  getTomorrow: (currentDate: string): string => {
    const date = parseDate(currentDate);
    return format(addDays(date, 1), "yyyy-MM-dd");
  },
  getYesterday: (currentDate: string): string => {
    const date = parseDate(currentDate);

    return format(subDays(date, 1), "yyyy-MM-dd");
  },
  displayDate: (date: Date): string => {
    return format(date, "PP");
  },
};

export { dateUtils, parseDate };
