export const nextDayAndTime = (
  daydelta: number,
  hour: number,
  minute: number,
) => {
  const now = new Date();
  const result = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daydelta,
    hour,
    minute,
  );
  if (
    result <
    new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
    )
  )
    result.setDate(result.getUTCDate() + 1);
  return result;
};

export const nextWeekAndTime = (
  daydelta: number,
  hour: number,
  minute: number,
) => {
  const now = new Date();
  const result = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daydelta,
    hour,
    minute,
  );
  if (
    result <
    new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
    )
  )
    result.setDate(result.getUTCDate() + 1);
  return result;
};

export const endEU = () => new Date(nextDayAndTime(0, 3, 0).toString());
export const endNA = () => new Date(nextDayAndTime(0, 9, 0).toString());
export const endAsia = () => new Date(nextDayAndTime(1, 20, 0).toString());
export const endWeekEU = () => new Date(nextWeekAndTime(0, 3, 0).toString());
export const endWeekNA = () => new Date(nextWeekAndTime(0, 9, 0).toString());
export const endWeekAsia = () => new Date(nextWeekAndTime(1, 20, 0).toString());
