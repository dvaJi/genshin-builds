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

export const localeToHSRLang = (locale: string | undefined) => {
  switch (locale) {
    case "en":
      return "en";
    case "es":
      return "es";
    case "ja":
      return "jp";
    case "zh-tw":
      return "cht";
    case "cn":
      return "cn";
    case "de":
      return "de";
    case "fr":
      return "fr";
    case "id":
      return "id";
    // case "it":
    //   return "italian";
    case "ko":
      return "kr";
    case "pt":
      return "pt";
    case "ru":
      return "ru";
    case "th":
      return "th";
    // case "tr":
    //   return "turkish";
    case "vi":
      return "vi";

    default:
      return "en";
  }
};