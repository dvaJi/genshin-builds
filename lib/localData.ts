export async function getLocale(lang: string) {
  try {
    const module = await import(`../locales/${lang}.json`);
    return module.default;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function getCharacterBuild(id: string) {
  try {
    const module = await import(`../_content/data/builds/${id}.json`);
    return module.default;
  } catch (err) {
    console.error(err);
    return [];
  }
}
