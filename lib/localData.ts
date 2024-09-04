import { Build as HSRBuild } from "interfaces/hsr/build";
import { getHSRData } from "./dataApi";

export async function getLocale(lang: string, game: string) {
  try {
    const locale = await import(`../locales/${game}/${lang}.json`);
    return locale.default;
  } catch (err) {
    try {
      const locale = await import(`../locales/${game}/en.json`);
      return locale.default;
    } catch (err) {
      return {};
    }
  }
}

export async function getRemoteData<T>(
  game: string,
  dataFile: string,
  revalidate = 60 * 60 * 24
) {
  try {
    const res = await fetch(
      `${process.env.SITEDATA_URL}/${game}-${dataFile}.json`,
      {
        next: {
          revalidate,
        },
      }
    );
    const data = await res.json();
    return data as T;
  } catch (err) {
    console.log("Data not found", { game, dataFile });
    return {} as T;
  }
}

export async function getSafeRemoteData<T>(
  game: string,
  dataFile: string,
  revalidate = 60 * 60 * 24
): Promise<[boolean, T]> {
  try {
    const data = await getRemoteData<T>(game, dataFile, revalidate);
    return [true, data];
  } catch (err) {
    console.log("Data not found", { game, dataFile });
    return [false, {} as T];
  }
}

export async function getData<T>(game: string, dataFile: string) {
  try {
    const data = require(`../_content/${game}/data/${dataFile}.json`);
    return data as T;
  } catch (err) {
    console.log("Data not found", { game, dataFile });
    return {} as T;
  }
}

export async function getCommon(
  lang: string,
  game: string
): Promise<Record<string, string>> {
  try {
    const common = require(`../_content/${game}/data/common.json`);
    return common[lang] || common["en"];
  } catch (err) {
    console.log("Common not found");
    return {};
  }
}

export async function getStarRailBuild(
  characterId: string
): Promise<HSRBuild | null> {
  try {
    let id = characterId;

    if (characterId.startsWith("trailblazer_destruction")) {
      id = "trailblazer_destruction";
    } else if (characterId.startsWith("trailblazer_preservation")) {
      id = "trailblazer_preservation";
    }

    if (id) {
      const _relics = await getHSRData<HSRBuild>({
        resource: "builds",
        language: 'en',
        filter: {
          id: id,
        },
      });
      return _relics || null;
    }

    // if (id) {
    //   return (builds as any)[id] || null;
    // }
    const _builds = await getHSRData<HSRBuild>({
      resource: "builds",
      language: 'en',
    });

    return _builds
  } catch (err) {
    console.error(err);
    return null;
  }
}
