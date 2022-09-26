import fs from "fs";
import { join } from "path";

import { Character } from "interfaces/tof/character";

const TOF_DATA_PATH = join(process.cwd(), "_content", "tof", "data");

export function getCharacters(locale: string): Character[] {
  const guideData = fs.readFileSync(
    join(TOF_DATA_PATH, `simulacra.json`),
    "utf8"
  );
  const characters = JSON.parse(guideData)[locale];
  return characters as Character[];
}

export function getCharacterById(
  locale: string,
  id: string
): Character | undefined {
  const characters = getCharacters(locale);
  return characters.find((character) => character.id === id);
}
