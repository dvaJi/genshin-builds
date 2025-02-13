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
  light_cone:  LightCone | null;
  relics:      Relic[];
  relic_sets:  RelicSet[];
  attributes:  Addition[];
  additions:   Addition[];
  properties:  Addition[];
  pos:         number[];
}

export interface Addition {
  field:   string;
  name:    string;
  icon:    string;
  value:   number;
  display: string;
  percent: boolean;
  type?:   string;
  count?:  number;
  step?:   number;
}

export interface Avatar {
  id:     string;
  name:   string;
  color?: Color;
  icon:   string;
}

export enum Color {
  The00Ff9C = "#00FF9C",
  The47C7Fd = "#47C7FD",
  The8872F1 = "#8872F1",
}

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
  id:        string;
  level:     number;
  anchor:    string;
  max_level: number;
  icon:      string;
  parent:    null | string;
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
  memory_data:       MemoryData;
  universe_level:    number;
  light_cone_count:  number;
  avatar_count:      number;
  achievement_count: number;
}

export interface MemoryData {
  level:       number;
  chaos_id:    number;
  chaos_level: number;
}
