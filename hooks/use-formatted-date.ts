import { useEffect, useState } from "react";

const useFormattedDate = (
  date: string | number | Date,
  // locales?: string | string[] | undefined,
  options?: Intl.DateTimeFormatOptions | undefined
) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    let _date: Date;
    if (typeof date === "string") {
      _date = new Date(date);
    } else if (typeof date === "number") {
      _date = new Date(date);
    } else {
      _date = date;
    }

    const dateFmtd = new Intl.DateTimeFormat(undefined, options).format(_date);
    setFormattedDate(dateFmtd);
  }, [date, options]);

  return formattedDate;
};

export default useFormattedDate;
