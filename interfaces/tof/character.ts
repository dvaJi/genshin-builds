type Element = "Ice";
type Rarity = "N" | "R" | "SR" | "SSR";

export type Build = {
  set1: string[];
  set2: string[];
};

export type Skill = {
  name: string;
  type: string[];
  description: string;
};

export type AscensionMaterial = {
  id: string;
  name: string;
  rarity: Rarity;
  amount: number;
};

export type Ascension = {
  ascension: number;
  level: number;
  cost: number;
  mat1: AscensionMaterial;
  mat2: AscensionMaterial;
  mat3: AscensionMaterial;
};

export interface Character {
  id: string;
  name: string;
  weapon: string;
  weapon_id: string;
  birthday: string;
  birthplace: string;
  gender: string;
  info: string;
  description: string;
  like: string;
  dislike: string;
  element: Element;
  rarity: Rarity;
  role: string;
  resonance: string;
  shatter: number;
  charge: number;
  builds: Build[];
  skills: Skill[];
  weapon_type: {
    name: string;
    description: string;
  };
  weapon_resonance: {
    name: string;
    description: string;
  };
  advancement: string[];
  traits: { name: string; description: string }[];
  ascension: Ascension[];
}
