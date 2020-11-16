interface Bonus {
  count: number;
  value: string;
}

export interface Artifact {
  name: string;
  id: string;
  bonus: Bonus[];
}
