import fs from "fs";
import { join } from "path";

const contentsDirectory = join(process.cwd(), "_content");
const localeDirectory = join(process.cwd(), "locales");

export function getLocale(lang: string) {
  const fullPath = join(localeDirectory, `${lang}.json`);

  try {
    const locale = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(locale);
  } catch (err) {
    console.error(err);
    return {};
  }
}

export function getCharacterBuild(id: string) {
  const fullPath = join(contentsDirectory, "data", "builds", `${id}.json`);

  try {
    const locale = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(locale);
  } catch (err) {
    console.error(err);
    return [];
  }
}
