export const i18n = {
  defaultLocale: "en",
  locales: [
    "en",
    "es",
    "ja",
    "cn",
    "zh-tw",
    "de",
    "fr",
    "id",
    "it",
    "ko",
    "pt",
    "ru",
    "th",
    "tr",
    "vi",
  ],
} as const;

export type Locale = (typeof i18n)["locales"][number];
