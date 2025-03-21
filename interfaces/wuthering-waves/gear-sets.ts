export interface GearSets {
  name: string;
  bonus: Bonus[];
  id: string;
}

export interface Bonus {
  count: number;
  value: string;
}
