export type CharacterTeam = {
  id: string;
  c_min: number;
  element: string;
  role: string;
  description: string;
  artifacts: string[];
  main_stats: {
    sand: string[];
    globet: string[];
    circlet: string[];
  };
  sub_stats: string[];
  weapons: string[];
  name?: string;
};

export type TeamData = {
  name: string;
  tier: string;
  description: string;
  characters: CharacterTeam[];
};

export type Teams = Record<string, TeamData[]>;
