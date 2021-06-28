const isDev = process.env.NODE_ENV === "development";

module.exports = {
  i18n: {
    locales: [
      "en",
      "es",
      "ja",
      "zh-tw",
      "de",
      "fr",
      "id",
      "ko",
      "pt",
      "ru",
      "th",
      "vi",
    ],
    defaultLocale: "en",
    localeDetection: !isDev,
  },
};
