import type { Character, Material, TCGCard, Weapon } from "genshin-data";

export type BetaResource = {
  characters: (Character & { beta?: boolean })[];
  weapons: (Weapon & { beta?: boolean })[];
  materials: (Material & { beta?: boolean })[];
  tcg: (TCGCard & { beta?: boolean })[];
};
export type Beta = {
  [locale: string]: BetaResource;
};
