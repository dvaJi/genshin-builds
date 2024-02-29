"use client";

import {
  endAsia,
  endEU,
  endNA,
  endWeekAsia,
  endWeekEU,
  endWeekNA,
} from "@utils/server-time";
import { useEffect, useRef, useState } from "react";

type ServerTime = {
  EURemaining: string;
  NARemaining: string;
  AsiaRemaining: string;
  EUWeekRemaining: string;
  NAWeekRemaining: string;
  AsiaWeekRemaining: string;
  NA: Date;
  EU: Date;
  Asia: Date;
};

const _second = 1000;
const _minute = _second * 60;
const _hour = _minute * 60;
const _day = _hour * 24;

const calcRemaining = (endDate: Date) => {
  const now = new Date();
  const nowUTC = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  const distance = (endDate as any) - (nowUTC as any);

  const days = Math.floor(distance / _day);
  const hours = Math.floor((distance % _day) / _hour);
  const minutes = Math.floor((distance % _hour) / _minute);
  const seconds = Math.floor((distance % _minute) / _second);

  if (days > 0)
    return days + "D " + hours + "H " + minutes + "M " + seconds + "S";

  return hours + "H " + minutes + "M " + seconds + "S";
};

const calcRemainingToEndOfWeek = (serverEndTime: Date) => {
  const serverTime = new Date(serverEndTime);
  const serverTimeUTC = new Date(
    serverTime.getUTCFullYear(),
    serverTime.getUTCMonth(),
    serverTime.getUTCDate(),
    serverTime.getUTCHours(),
    serverTime.getUTCMinutes(),
    serverTime.getUTCSeconds()
  );

  // Calculate the end of the week (Sunday) based on the server time
  const endOfWeek = new Date(serverTimeUTC);
  endOfWeek.setUTCDate(
    serverTimeUTC.getUTCDate() + ((7 - serverTimeUTC.getUTCDay() || 7) % 7)
  );
  endOfWeek.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

  return calcRemaining(endOfWeek);
};

const useServerTime = (): ServerTime => {
  const [serverTime, setServerTime] = useState<ServerTime>({
    EURemaining: calcRemaining(endEU()),
    NARemaining: calcRemaining(endNA()),
    AsiaRemaining: calcRemaining(endAsia()),
    EUWeekRemaining: calcRemainingToEndOfWeek(endWeekEU()),
    NAWeekRemaining: calcRemainingToEndOfWeek(endWeekNA()),
    AsiaWeekRemaining: calcRemainingToEndOfWeek(endWeekAsia()),
    NA: endNA(),
    EU: endEU(),
    Asia: endAsia(),
  });

  const prevEndTimes = useRef({
    NA: serverTime.NA,
    EU: serverTime.EU,
    Asia: serverTime.Asia,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newEndTimes = {
        NA: endNA(),
        EU: endEU(),
        Asia: endAsia(),
      };

      if (
        newEndTimes.NA !== prevEndTimes.current.NA ||
        newEndTimes.EU !== prevEndTimes.current.EU ||
        newEndTimes.Asia !== prevEndTimes.current.Asia
      ) {
        setServerTime({
          EURemaining: calcRemaining(newEndTimes.EU),
          NARemaining: calcRemaining(newEndTimes.NA),
          AsiaRemaining: calcRemaining(newEndTimes.Asia),
          EUWeekRemaining: calcRemainingToEndOfWeek(endWeekEU()),
          NAWeekRemaining: calcRemainingToEndOfWeek(endWeekNA()),
          AsiaWeekRemaining: calcRemainingToEndOfWeek(endWeekAsia()),
          ...newEndTimes,
        });

        prevEndTimes.current = newEndTimes;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return serverTime;
};

export default useServerTime;
