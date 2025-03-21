export const languages = [
  {
    code: "en",
    name: "English",
  },
  {
    code: "es",
    name: "Spanish",
  },
  {
    code: "ja",
    name: "Japanese",
  },
  {
    code: "cn",
    name: "Chinese Simplified",
  },
  {
    code: "zh-tw",
    name: "Chinese Traditional",
  },
  {
    code: "de",
    name: "German",
  },
  {
    code: "fr",
    name: "French",
  },
  {
    code: "id",
    name: "Indonesian",
  },
  {
    code: "it",
    name: "Italian",
  },
  {
    code: "ko",
    name: "Korean",
  },
  {
    code: "pt",
    name: "Portuguese",
  },
  {
    code: "ru",
    name: "Russian",
  },
  {
    code: "th",
    name: "Thai",
  },
  {
    code: "tr",
    name: "Turkish",
  },
  {
    code: "vi",
    name: "Vietnamese",
  },
];
export const localeToLang = (locale: string | undefined) => {
  switch (locale) {
    case "en":
      return "english";
    case "es":
      return "spanish";
    case "ja":
      return "japanese";
    case "cn":
      return "chinese-simplified";
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
    case "cn":
      return "cn";
    case "zh-tw":
      return "cht";
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

export const localeToWWLang = (locale: string | undefined) => {
  switch (locale) {
    case "en":
      return "en";
    case "es":
      return "es";
    case "ja":
      return "ja";
    case "cn":
      return "cn";
    case "zh-tw":
      return "zh-tw";
    case "de":
      return "de";
    case "fr":
      return "fr";
    // case "id":
    //   return "id";
    // case "it":
    //   return "italian";
    case "ko":
      return "ko";
    // case "pt":
    //   return "pt";
    // case "ru":
    //   return "ru";
    // case "th":
    //   return "th";
    // case "tr":
    //   return "turkish";
    // case "vi":
    //   return "vi";

    default:
      return "en";
  }
};
