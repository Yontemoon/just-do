import {
  format,
  addDays,
  subDays,
  parse,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";
import { RecordModel } from "pocketbase";

const parseDate = (dateString: string): Date => {
  return parse(dateString, "yyyy-MM-dd", new Date());
};

const parseDateYYYYMM = (dateString: string): Date => {
  return parse(dateString, "yyyy-MM", new Date());
};

const dateToYYYYMM = (date: Date): string => {
  return format(date, "yyyy-MM");
};

const dateToYYYYMMdd = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

const dayUtils = {
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

const monthUtils = {
  today: () => {
    const today = new Date();
    return format(today, "yyyy-MM");
  },
  start: (date: string): string => {
    const parsedDate = parseDateYYYYMM(date);
    const start = startOfMonth(parsedDate);
    return format(start, "yyyy-MM-dd");
  },
  end: (date: string): string => {
    const parsedDate = parseDateYYYYMM(date);
    const end = endOfMonth(parsedDate);
    return format(end, "yyyy-MM-dd");
  },
  next: (date: string): string => {
    const parsedDate = parseDateYYYYMM(date);
    const nextMonth = addMonths(parsedDate, 1);
    return format(nextMonth, "yyyy-MM");
  },
  prev: (date: string): string => {
    const parsedDate = parseDateYYYYMM(date);
    const prevMonth = addMonths(parsedDate, -1);
    return format(prevMonth, "yyyy-MM");
  },
  formatYYYYMM: (date: string) => {
    const parsedDate = parseDate(date);
    return format(parsedDate, "yyyy-MM");
  },
};

const stringHash = (input: string): string[] => {
  const hashtagRegex = /#([\w]+)/g;
  const matches = input.match(hashtagRegex) || [];

  return matches.map((tag) => tag.slice(1).toLowerCase());
};

const createSetHash = (data: RecordModel[]): string[] => {
  const hashtags = new Set<string>();
  data.forEach((result) => {
    const todoHash = stringHash(result.todo);

    todoHash.forEach((element) => {
      if (!hashtags.has(element)) {
        hashtags.add(element);
      }
    });
  });
  return Array.from(hashtags);
};

export {
  dayUtils as dateUtils,
  parseDate,
  stringHash,
  createSetHash,
  monthUtils,
  parseDateYYYYMM,
  dateToYYYYMM,
  dateToYYYYMMdd,
};
