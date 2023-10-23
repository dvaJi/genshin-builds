export interface PlayerDataAPI {
  player:     Player;
  characters: Character[];
}

export interface Character {
  id:          string;
  name:        string;
  rarity:      number;
  rank:        number;
  level:       number;
  promotion:   number;
  icon:        string;
  preview:     string;
  portrait:    string;
  rank_icons:  string[];
  path:        Avatar;
  element:     Avatar;
  skills:      Skill[];
  skill_trees: SkillTree[];
  light_cone:  LightCone;
  relics:      Relic[];
  relic_sets:  RelicSet[];
  attributes:  Addition[];
  additions:   Addition[];
  properties:  Addition[];
}

export interface Addition {
  field:   Field;
  name:    Name;
  icon:    Icon;
  value:   number;
  display: string;
  percent: boolean;
  type?:   string;
  count?:  number;
  step?:   number;
}

export type Field = "atk" | "effect_hit" | "quantum_dmg" | "hp" | "def" | "effect_res" | "crit_dmg" | "break_dmg" | "sp_rate" | "spd" | "crit_rate" | "wind_dmg" | "fire_dmg" | "ice_dmg";

export type Icon = "icon/property/IconAttack.png" | "icon/property/IconStatusProbability.png" | "icon/property/IconQuantumAddedRatio.png" | "icon/property/IconMaxHP.png" | "icon/property/IconDefence.png" | "icon/property/IconStatusResistance.png" | "icon/property/IconCriticalDamage.png" | "icon/property/IconBreakUp.png" | "icon/property/IconEnergyRecovery.png" | "icon/property/IconSpeed.png" | "icon/property/IconCriticalChance.png" | "icon/property/IconWindAddedRatio.png" | "icon/property/IconFireAddedRatio.png" | "icon/property/IconIceAddedRatio.png";

export type Name = "ATK" | "Effect Hit Rate" | "Quantum DMG Boost" | "HP" | "DEF" | "Effect RES" | "CRIT DMG" | "Break Effect" | "Energy Regeneration Rate" | "SPD" | "CRIT Rate" | "Wind DMG Boost" | "Fire DMG Boost" | "Ice DMG Boost";

export interface Avatar {
  id:     string;
  name:   string;
  color?: Color;
  icon:   string;
}

export type Color = "#1C29BA" | "#00FF9C" | "#47C7FD";

export interface LightCone {
  id:         string;
  name:       string;
  rarity:     number;
  rank:       number;
  level:      number;
  promotion:  number;
  icon:       string;
  preview:    string;
  portrait:   string;
  path:       Avatar;
  attributes: Addition[];
  properties: Addition[];
}

export interface RelicSet {
  id:         string;
  name:       string;
  icon:       string;
  num:        number;
  desc:       string;
  properties: Addition[];
}

export interface Relic {
  id:         string;
  name:       string;
  set_id:     string;
  set_name:   string;
  rarity:     number;
  level:      number;
  icon:       string;
  main_affix: Addition;
  sub_affix:  Addition[];
}

export interface SkillTree {
  id:    string;
  level: number;
  icon:  string;
}

export interface Skill {
  id:          string;
  name:        string;
  level:       number;
  max_level:   number;
  element:     Avatar | null;
  type:        string;
  type_text:   string;
  effect:      string;
  effect_text: string;
  simple_desc: string;
  desc:        string;
  icon:        string;
}

export interface Player {
  uid:          string;
  nickname:     string;
  level:        number;
  world_level:  number;
  friend_count: number;
  avatar:       Avatar;
  signature:    string;
  is_display:   boolean;
  space_info:   SpaceInfo;
}

export interface SpaceInfo {
  challenge_data:     ChallengeData;
  pass_area_progress: number;
  light_cone_count:   number;
  avatar_count:       number;
  achievement_count:  number;
}

export interface ChallengeData {
  maze_group_id:        number;
  maze_group_index:     number;
  pre_maze_group_index: number;
}
