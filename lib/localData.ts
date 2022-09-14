export async function getLocale(lang: string) {
  try {
    const locale = await import(`../locales/${lang}.json`);
    return locale.default;
  } catch (err) {
    console.error(err);
    return {};
  }
}

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
      return (builds as any)[id] || "";
    }

    return builds as any;
  } catch (err) {
    console.error(err);
    return {};
  }
}
