"use client";

import { getTimeAgo } from "@lib/timeago";

type Props = {
  date: string;
  locale: string;
};

export default function TimeAgo({ date, locale }: Props) {
  const timeAgo = getTimeAgo(new Date(date).getTime(), locale);

  return <>{timeAgo}</>;
}
