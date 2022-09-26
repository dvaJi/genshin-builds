export type GameProps = {
  name: string;
  slug: string;
  path: string;
};

type GamesAvailable = "GENSHIN" | "TOF";

export const GAME: Record<GamesAvailable, GameProps> = {
  GENSHIN: {
    name: "Genshin Impact",
    slug: "genshin",
    path: "/",
  },
  TOF: {
    name: "Tower of Fantasy",
    slug: "tof",
    path: "/tof",
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

export function isTOF(route: string) {
  return isGame(GAME.TOF, route);
}

export function isGenshin(route: string) {
  return isGame(GAME.GENSHIN, route);
}

export const tofLocales = ["en", "es", "de", "fr", "id", "ja", "pt", "th"];
export const genshinLocales = [
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
];
