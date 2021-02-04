export const localeToLang = (locale: string | undefined) => {
  switch (locale) {
    case "en":
      return "english";
    case "es":
      return "spanish";
    // case "jp":
    //   return "japanese";
    default:
      return "english";
  }
};
