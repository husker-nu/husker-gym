import { DayHour } from "@/types";
import { formatDistance, subMinutes } from "date-fns";

export const bostonTime = (): Date => {
  const offset = new Date().getTimezoneOffset();
  return subMinutes(new Date(), offset);
};

export const utcToEst = (date: Date): Date => {
  return subMinutes(date, 300);
};

export const getUtcToEstDayHour = (date: Date): DayHour => {
  // utc to est conversion
  // TODO: use timezone instead of offset to account for DST
  const est = subMinutes(date, 300);
  return {
    day: est.getUTCDay(),
    hour: est.getUTCHours(),
  };
};



export const serializeListWithDate = <T>(list: T[], dateKey: string): T[] => {
  return list.map((item: any) => ({
    ...item,
    [dateKey]: (item[dateKey] as Date).toString(),
  }));
};

export const parseListWithDate = <T>(list: T[], dateKey: string): T[] => {
  return list.map((item: any) => ({
    ...item,
    [dateKey]: new Date(item[dateKey]),
  }));
};

