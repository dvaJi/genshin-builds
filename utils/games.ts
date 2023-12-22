export type GameProps = {
  name: string;
  slug: string;
  path: string;
  adminPath: string;
};

type GamesAvailable = "GENSHIN" | "HSR" | "ZENLESS";

export const GAME: Record<GamesAvailable, GameProps> = {
  GENSHIN: {
    name: "Genshin Impact",
    slug: "genshin",
    path: "/",
    adminPath: "/admin/genshin",
  },
  HSR: {
    name: "Honkai: Star Rail",
    slug: "hsr",
    path: "/hsr",
    adminPath: "/admin/hsr",
  },
  ZENLESS: {
    name: "Zenless Zone Zero",
    slug: "zenless",
    path: "/zenless",
    adminPath: "/admin/zenless",
  },
};

function isGame(game: GameProps, route: string) {
  if (route.startsWith(game.path)) {
    return true;
  }

  if (game.name === GAME.GENSHIN.name) {
    return true;
  }

  return false;
}

export function isGenshin(route: string) {
  return isGame(GAME.GENSHIN, route);
}

export function isHSR(route: string) {
  return isGame(GAME.HSR, route);
}

export const genshinLocales = [
  "en",
  "es",
  "ja",
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
];
