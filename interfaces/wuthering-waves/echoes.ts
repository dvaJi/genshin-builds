export interface Echoes {
  id: string;
  name: string;
  code: string;
  type?: string;
  intensity?: Intensity;
  place?: Place;
  icon: string;
  skill: Skill;
  group: Group[];
  rarity: number[];
  intensityCode: number;
  monsterInfo: number;
}

export interface Group {
  id: number;
  name: Name;
  icon: string;
  color: Color;
  set: Set[];
}

export enum Color {
  B46Bffff = "B46BFFFF",
  C72C25Ff = "C72C25FF",
  C98Bb3Ff = "C98BB3FF",
  F0744EFF = "F0744EFF",
  F8E56Cff = "F8E56CFF",
  Ffffffff = "FFFFFFFF",
  The41Aefbff = "41AEFBFF",
  The55Ffb5Ff = "55FFB5FF",
  The9Bdb2Dff = "9BDB2DFF",
}

export enum Name {
  CelestialLight = "Celestial Light",
  FreezingFrost = "Freezing Frost",
  LingeringTunes = "Lingering Tunes",
  MoltenRift = "Molten Rift",
  MoonlitClouds = "Moonlit Clouds",
  RejuvenatingGlow = "Rejuvenating Glow",
  SierraGale = "Sierra Gale",
  SunSinkingEclipse = "Sun-sinking Eclipse",
  VoidThunder = "Void Thunder",
}

export interface Set {
  id: number;
  desc: string;
  param: string[];
  key: number;
}

export enum Intensity {
  CalamityClass = "Calamity Class",
  CommonClass = "Common Class",
  EliteClass = "Elite Class",
  OverlordClass = "Overlord Class",
}

export enum Place {
  Huanglong = "Huanglong",
}

export interface Skill {
  desc: string;
  simpleDesc: string;
  param: Array<string[]>;
  icon: string;
}
