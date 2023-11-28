export type FoodItem = {
  id: string;
  name: string;
  rarity: number;
  type: string;
  effect: string;
  character?: {
    id: string;
    name: string;
  };
};
