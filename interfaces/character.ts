interface Build {
  name: string;
  description: string;
  weapon_1: string;
  weapon_2: string;
  set_1: string;
  set2_1: string;
  stats: string[];
}

interface SkillModifier {
  stat: string;
  value: string;
}

interface Skill {
  name: string;
  icon: boolean;
  type: string;
  description: string;
  modifiers: SkillModifier[];
}

interface Passive {
  name: string;
  icon: boolean;
  unlock?: string;
  description: string;
}

interface Constellation {
  name: string;
  icon: boolean;
  description: string;
}

export interface Character {
  name: string;
  id: number;
  tier: number;
  tier_overall: number;
  tier_exploration: number;
  tier_bosses: number;
  tier_dungeons: number;
  tier_abyss: number;
  role: string;
  soon: boolean;
  new: boolean;
  region: string;
  description: string;
  location: string;
  rarity: number;
  type: string;
  weapon: string;
  asc_stat: string;
  builds?: Build[];
  skills?: Skill[];
  passives?: Passive[];
  constellations?: Constellation[];
}
