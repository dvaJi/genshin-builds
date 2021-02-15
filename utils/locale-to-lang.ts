export const localeToLang = (locale: string | undefined) => {
  switch (locale) {
    case "en":
      return "english";
    case "es":
      return "spanish";
    case "ja":
      return "japanese";
    default:
      return "english";
  }
};
