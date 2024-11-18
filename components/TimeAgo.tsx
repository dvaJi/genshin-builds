"use client";

import { useEffect, useState } from "react";

import { getTimeAgo } from "@lib/timeago";

type Props = {
  date: string;
  locale?: string;
};

export default function TimeAgo({ date, locale }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const timeAgo = getTimeAgo(new Date(date).getTime(), locale);
  return <>{timeAgo}</>;
}
