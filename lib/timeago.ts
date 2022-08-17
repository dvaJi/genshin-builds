const DATE_UNITS = {
  day: 86400,
  hour: 3600,
  minute: 60,
};

const getSecondsDiff = (timestamp: number) =>
  (new Date().getTime() - timestamp) / 1000;
const getUnitAndValueDate = (secondsElapsed: number) => {
  for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    if (secondsElapsed >= secondsInUnit || unit === "second") {
      const value = Math.floor(secondsElapsed / secondsInUnit) * -1;
      return { value, unit: unit as Intl.RelativeTimeFormatUnit };
    }
  }

  return { value: -1, unit: "day" as Intl.RelativeTimeFormatUnit };
};

export const getTimeAgo = (timestamp: number, locale: string) => {
  const rtf = new Intl.RelativeTimeFormat(locale);

  const secondsElapsed = getSecondsDiff(timestamp);
  const { value, unit } = getUnitAndValueDate(secondsElapsed)!;
  return rtf.format(value, unit);
};
