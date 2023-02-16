export const localeToLang = (locale: string | undefined) => {
  switch (locale) {
    case "en":
      return "english";
    case "es":
      return "spanish";
    case "ja":
      return "japanese";
    case "zh-tw":
      return "chinese-traditional";
    case "de":
      return "german";
    case "fr":
      return "french";
    case "id":
      return "indonesian";
    case "it":
      return "italian";
    case "ko":
      return "korean";
    case "pt":
      return "portuguese";
    case "ru":
      return "russian";
    case "th":
      return "thai";
    case "tr":
      return "turkish";
    case "vi":
      return "vietnamese";

    default:
      return "english";
  }
};
