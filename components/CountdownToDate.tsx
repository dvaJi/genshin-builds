"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";

dayjs.extend(relativeTime);

interface CountdownProps {
  targetDate: string;
  boxClass?: string;
  countdownRefreshInterval?: number;
  customEndText?: string;
}

const CountdownToDate: React.FC<CountdownProps> = ({
  targetDate,
  countdownRefreshInterval = 1000,
  boxClass,
  customEndText,
}) => {
  const parsedEndDate = dayjs(targetDate);
  const [timeLeft, setTimeLeft] = useState(parsedEndDate.diff(dayjs()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(parsedEndDate.diff(dayjs()));
    }, countdownRefreshInterval);

    return () => {
      clearInterval(timer);
    };
  }, [parsedEndDate, countdownRefreshInterval]);

  if (dayjs().isAfter(parsedEndDate)) {
    return customEndText ? <div>{customEndText}</div> : null;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const min = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const sec = Math.floor((timeLeft % (1000 * 60)) / 1000);
  return (
    <div className="grid auto-cols-max grid-flow-col gap-5 text-center">
      <div
        className={clsx(
          "flex flex-col",
          boxClass ? "" : "rounded-lg bg-zinc-950/50 p-2",
        )}
      >
        <span className="font-mono text-5xl">
          <span>{days}</span>
        </span>
        days
      </div>
      <div
        className={clsx(
          "flex flex-col",
          boxClass ? "" : "rounded-lg bg-zinc-950/50 p-2",
        )}
      >
        <span className="font-mono text-5xl">
          <span>{hours}</span>
        </span>
        hours
      </div>
      <div
        className={clsx(
          "flex flex-col",
          boxClass ? "" : "rounded-lg bg-zinc-950/50 p-2",
        )}
      >
        <span className="font-mono text-5xl">
          <span>{min}</span>
        </span>
        min
      </div>
      <div
        className={clsx(
          "flex flex-col",
          boxClass ? "" : "rounded-lg bg-zinc-950/50 p-2",
        )}
      >
        <span className="font-mono text-5xl">
          <span>{sec}</span>
        </span>
        sec
      </div>
    </div>
  );
};

export default CountdownToDate;
