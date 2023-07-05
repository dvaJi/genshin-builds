export interface Changelog {
  items:   Items;
  version: string;
}

export interface Items {
  avatar:    string[];
  weapon:    string[];
  material?: string[];
  food:      string[];
  artifact?: string[];
  tcg?:      string[];
}
