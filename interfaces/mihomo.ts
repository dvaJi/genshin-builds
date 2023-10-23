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

export enum Field {
  AllDmg = "all_dmg",
  Atk = "atk",
  BreakDmg = "break_dmg",
  CritDmg = "crit_dmg",
  CritRate = "crit_rate",
  Def = "def",
  EffectHit = "effect_hit",
  EffectRes = "effect_res",
  FireDmg = "fire_dmg",
  HP = "hp",
  HealRate = "heal_rate",
  LightningDmg = "lightning_dmg",
  QuantumDmg = "quantum_dmg",
  SPRate = "sp_rate",
  Spd = "spd",
}

export enum Icon {
  IconPropertyIconAttackPNG = "icon/property/IconAttack.png",
  IconPropertyIconBreakUpPNG = "icon/property/IconBreakUp.png",
  IconPropertyIconCriticalChancePNG = "icon/property/IconCriticalChance.png",
  IconPropertyIconCriticalDamagePNG = "icon/property/IconCriticalDamage.png",
  IconPropertyIconDefencePNG = "icon/property/IconDefence.png",
  IconPropertyIconEnergyRecoveryPNG = "icon/property/IconEnergyRecovery.png",
  IconPropertyIconFireAddedRatioPNG = "icon/property/IconFireAddedRatio.png",
  IconPropertyIconHealRatioPNG = "icon/property/IconHealRatio.png",
  IconPropertyIconMaxHPPNG = "icon/property/IconMaxHP.png",
  IconPropertyIconQuantumAddedRatioPNG = "icon/property/IconQuantumAddedRatio.png",
  IconPropertyIconSpeedPNG = "icon/property/IconSpeed.png",
  IconPropertyIconStatusProbabilityPNG = "icon/property/IconStatusProbability.png",
  IconPropertyIconStatusResistancePNG = "icon/property/IconStatusResistance.png",
  IconPropertyIconThunderAddedRatioPNG = "icon/property/IconThunderAddedRatio.png",
}

export enum Name {
  Atk = "ATK",
  BreakEffect = "Break Effect",
  CRITRate = "CRIT Rate",
  CritDmg = "CRIT DMG",
  DMGBoost = "DMG Boost",
  Def = "DEF",
  EffectHitRate = "Effect Hit Rate",
  EffectRES = "Effect RES",
  EnergyRegenerationRate = "Energy Regeneration Rate",
  FireDMGBoost = "Fire DMG Boost",
  HP = "HP",
  LightningDMGBoost = "Lightning DMG Boost",
  OutgoingHealingBoost = "Outgoing Healing Boost",
  QuantumDMGBoost = "Quantum DMG Boost",
  Spd = "SPD",
}

export interface Avatar {
  id:     string;
  name:   string;
  color?: Color;
  icon:   string;
}

export enum Color {
  F84F36 = "#F84F36",
  Ffffff = "#FFFFFF",
  The1C29Ba = "#1C29BA",
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
  memory_data:        MemoryData;
  universe_level:     number;
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

export interface MemoryData {
  level:       number;
  chaos_id:    number;
  chaos_level: number;
}