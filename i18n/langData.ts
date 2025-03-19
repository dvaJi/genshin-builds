import {
  localeToHSRLang,
  localeToLang,
  localeToWWLang,
} from "@utils/locale-to-lang";

type Game = "genshin" | "hsr" | "zenless" | "wuthering-waves";

export const getLangData = (locale: string, game: Game) => {
  if (game === "hsr" || game === "zenless") {
    return localeToHSRLang(locale || "en");
  }

  if (game === "wuthering-waves") {
    return localeToWWLang(locale || "en");
  }

  if (game === "genshin") {
    return localeToLang(locale || "en");
  }

  return locale || "en";
};
