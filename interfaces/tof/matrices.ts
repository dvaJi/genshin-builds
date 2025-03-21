export interface Matrices {
  id: string;
  rarity: number;
  name: string;
  version: string;
  assets: Assets;
  banners: Banner[];
  description: string;
  meta: Meta;
  sets: Set[];
  simulacrumId: null | string;
}

export interface Assets {
  icon: string;
  iconLarge: string;
  characterArtwork: string;
}

export interface Banner {
  bannerNumber: number;
  isFinalBanner: boolean;
  endDate: Date;
  startDate: Date;
}

export interface Meta {
  recommendedWeapons: string[];
}

export interface Set {
  description: string;
  need: number;
}
