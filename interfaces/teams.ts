import { Character } from "genshin-data";

type Primary = {
  characterId: string;
  role: string;
};

type Alternative = {
  characters: string[];
  substitutes: string[];
};

export interface Team {
  primary: Primary[];
  alternatives: Alternative[];
}

type PrimaryFull = {
  character: Character;
  role: string;
};

type AlternativeFull = {
  characters: Character[];
  substitutes: Character[];
};

export interface TeamFull {
  primary: PrimaryFull[];
  alternatives: AlternativeFull[];
}
