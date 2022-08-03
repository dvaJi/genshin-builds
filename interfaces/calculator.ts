type ExpLevel = {
  lvl: number;
  asc: boolean;
  asclLvl: number;
};

type TalentLevel = {
  aa: number;
  skill: number;
  burst: number;
};

export type CalculationParam = {
  currentLevel: ExpLevel;
  intendedLevel: ExpLevel;
  currentTalentLvl: TalentLevel;
  intendedTalentLvl: TalentLevel;
};

export type CalculationItemResult = {
  id: string;
  img: string;
  name: string;
  amount: number;
  rarity: number;
};

export type CalculationCharacterResult = {
  expWasted: number;
  items: CalculationItemResult[];
};
