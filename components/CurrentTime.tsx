"use client";

import { useEffect, useState } from "react";

type Props = {
  interval?: number;
  format?: Intl.DateTimeFormatOptions;
};

export default function CurrentTime({ interval = 1000, format }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), interval);
    return () => clearInterval(timer);
  }, [interval]);

  return <>{time.toLocaleString(undefined, format)}</>;
}
