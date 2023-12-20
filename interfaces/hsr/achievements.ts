export interface Achievement {
  _id: number;
  id: string;
  name: string;
  sortOrder: number;
  rarity: Rarity;
  seriesId: number;
  seriesText: string;
  description: string;
  hiddenDescription?: string;
  recordText?: string;
}

export enum Rarity {
  High = 'High',
  Low = 'Low',
  Mid = 'Mid',
}
