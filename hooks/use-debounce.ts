"use client";

import { useEffect, useState } from "react";

export default function useDebounce<T>(
  value: T,
  delay: number,
  minLength: number = 1,
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (
      typeof value === "string" &&
      value.length > 0 &&
      value.length < minLength
    ) {
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}
