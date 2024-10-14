import { format, addDays, subDays, parse } from "date-fns";
import { RecordModel } from "pocketbase";

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

const stringHash = (input: string): string[] => {
  const hashtagRegex = /#([\w]+)/g;
  const matches = input.match(hashtagRegex) || [];
  console.log(matches);
  return matches.map((tag) => tag.slice(1).toLowerCase());
};

const createSetHash = (data: RecordModel[]): string[] => {
  const hashtags = new Set<string>();
  data.forEach((result) => {
    const todoHash = stringHash(result.todo);
    
    todoHash.forEach(element => {
      if (!hashtags.has(element)) {
        hashtags.add(element)
      }
    });

  });
  console.log("hashtags", hashtags);
  return Array.from(hashtags);
};

export { dateUtils, parseDate, stringHash, createSetHash };
