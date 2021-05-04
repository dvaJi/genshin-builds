export async function getLocale(lang: string) {
  try {
    const module = await import(`../locales/${lang}.json`);
    return module.default;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function getCharacterBuild(id?: string) {
  try {
    const { default: builds } = await import(`../_content/data/builds.json`);

    if (id) {
      return (builds as any)[id];
    }

    return builds as any;
  } catch (err) {
    console.error(err);
    return [];
  }
}
