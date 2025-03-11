import type { CharBuild, MostUsedBuild } from "@interfaces/build";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import type { TeamData } from "@interfaces/teams";

import {
  GENSHIN_API_URL,
  HSR_API_URL,
  WW_API_URL,
  ZENLESS_API_URL,
} from "./constants";

type APIOptions = {
  resource: string;
  language?: string;
  select?: string[];
  asMap?: boolean;
  filter?: {
    id: string;
  };
  revalidate?: number;
};

export async function getGenshinCharacterDetail(id: string, language: string) {
  const baseUrl = GENSHIN_API_URL.replace(
    "genshin/api",
    "genshin/character-detail",
  );
  const url = new URL(baseUrl);

  url.searchParams.append("id", id);
  url.searchParams.append("language", language);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      next: {
        tags: ["genshin-data", "genshin-character-detail"],
        revalidate: 0,
      },
    });

    return res.json() as Promise<{
      character: Character;
      weapons: Record<string, Weapon>;
      artifacts: Record<string, Artifact>;
      builds: CharBuild[];
      buildsNotes?: string;
      mubuild: MostUsedBuild;
      charactersMap: Record<string, Character>;
      teams: TeamData[];
    }>;
  } catch (error) {
    console.log(url, error);
    throw error;
  }
}

export async function getGenshinCharacterTeams(id: string, language: string) {
  const baseUrl = GENSHIN_API_URL.replace("genshin/api", "genshin/teams");
  const url = new URL(baseUrl);

  url.searchParams.append("id", id);
  url.searchParams.append("language", language);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      next: {
        tags: ["genshin-data", "genshin-teams"],
      },
    });

    return res.json() as Promise<{
      overview: string;
      teams: TeamData[];
      weaponsMap: Record<string, Weapon>;
      charactersMap: Record<string, Character>;
      artifactsMap: Record<string, Artifact>;
    }>;
  } catch (error) {
    console.log(url, error);
    throw error;
  }
}

export async function getGenshinData<T>(options: APIOptions): Promise<T> {
  return getData<T>(GENSHIN_API_URL, options, ["genshin-data"]);
}

export async function getHSRData<T>(options: APIOptions) {
  return getData<T>(HSR_API_URL, options, ["hsr-data"]);
}

export async function getWWData<T>(options: APIOptions) {
  try {
    return getData<T>(WW_API_URL, options, ["ww-data"]);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getZenlessData<T>(options: APIOptions) {
  try {
    return getData<T>(ZENLESS_API_URL, options, ["zenless-data"]);
  } catch (error) {
    console.log(error);
    return null;
  }
}

const isRetryableError = (error: unknown) => {
  return (
    (error instanceof SyntaxError && error.message.includes("Bad Gateway")) ||
    (error instanceof Error &&
      "code" in error &&
      error.code === "UND_ERR_SOCKET" &&
      error.message.includes("other side closed"))
  );
};

async function getData<T>(
  url: string,
  options: APIOptions,
  tags: string[],
): Promise<T> {
  const MAX_RETRIES = 3;
  let revalidate = options.revalidate ? options.revalidate : 86400;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        next: {
          revalidate,
          tags,
        },
      });

      if (options.filter && res.status === 404) return null as T;

      if (!res.ok) {
        const text = await res.text();
        console.error(
          "Error fetching data",
          res.statusText,
          text,
          JSON.stringify(options),
        );
        throw new Error(res.statusText);
      }

      if (options.asMap) {
        const data = await res.json();
        return data.reduce((acc: any, curr: any) => {
          acc[curr.id] = curr;
          return acc;
        }, {} as any) as T;
      }

      return res.json() as Promise<T>;
    } catch (error) {
      console.log(i, error);
      if (isRetryableError(error) && i < MAX_RETRIES - 1) {
        console.log(`Retrying... (${MAX_RETRIES - i - 1} attempts remaining)`);
        continue;
      } else {
        console.error(
          "Error fetching data",
          JSON.stringify({
            options,
            url,
            next: {
              revalidate,
              tags,
            },
          }),
          error,
        );
        throw error; // if it's a different error or we've reached the max retries, throw the error
      }
    }
  }

  console.error("Max retries reached", options);
  throw new Error("Max retries reached");
}
