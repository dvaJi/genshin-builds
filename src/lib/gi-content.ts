import type { TeamData } from "@/interfaces/genshin/teams";

export const getCommon = async (
  locale: string
): Promise<Record<string, string>> => {
  const common = await import("../_content/genshin/data/common.json");
  return (common as any)[locale];
};

export async function getCharacterBuild(id?: string) {
  try {
    const { default: builds } = await import(
      `../_content/genshin/data/builds.json`
    );

    if (id) {
      return (builds as any)[id];
    }

    return builds as any;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getCharacterMostUsedBuild(id?: string) {
  try {
    const { default: builds } = await import(
      `../_content/genshin/data/mostusedbuilds.json`
    );

    if (id) {
      return (builds as any)[id] || null;
    }

    return builds as any;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function getCharacterOfficialBuild(id?: string) {
  try {
    const { default: builds } = await import(
      `../_content/genshin/data/officialbuilds.json`
    );

    if (id) {
      return (builds as any)[id] || null;
    }

    return builds as any;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function getCharacterRecommendedTeams(
  id?: string
): Promise<TeamData[]> {
  try {
    const { default: teams } = await import(
      `../_content/genshin/data/teams.json`
    );

    if (id) {
      return (teams as any)[id] || null;
    }

    return teams as any;
  } catch (err) {
    console.error(err);
    return [];
  }
}
