"use client";

import { endAsia, endEU, endNA } from "@utils/server-time";
import { useEffect, useState } from "react";

type ServerTime = {
  EURemaining: string;
  NARemaining: string;
  AsiaRemaining: string;
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

  const hours = Math.floor((distance % _day) / _hour);
  const minutes = Math.floor((distance % _hour) / _minute);
  const seconds = Math.floor((distance % _minute) / _second);

  return hours + "H " + minutes + "M " + seconds + "S";
};

const useServerTime = (): ServerTime => {
  const [serverTime, setServerTime] = useState<ServerTime>({
    EURemaining: calcRemaining(endEU()),
    NARemaining: calcRemaining(endNA()),
    AsiaRemaining: calcRemaining(endAsia()),
    NA: endNA(),
    EU: endEU(),
    Asia: endAsia(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setServerTime({
        EURemaining: calcRemaining(endEU()),
        NARemaining: calcRemaining(endNA()),
        AsiaRemaining: calcRemaining(endAsia()),
        NA: endNA(),
        EU: endEU(),
        Asia: endAsia(),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [serverTime]);

  return serverTime;
};

export default useServerTime;
