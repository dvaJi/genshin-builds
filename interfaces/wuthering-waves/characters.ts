export interface Characters {
    name:          string;
    id:            string;
    materials:     string[];
    teams:         string[];
    primary_echo:  string[];
    echoes:        string[];
    substats:      string[];
    sets:          string[];
    weapons:       string[];
    rarity:        number;
    element:       string[];
    type:          string[];
    hp:            number;
    atk:           number;
    def:           number;
    total_stats:   Stat[];
    passive_stats: Stat[];
    skills:        Chain[];
    passives:      Chain[];
    swap:          Chain[];
    chain:         Chain[];
}

export interface Chain {
    name:        string;
    icon:        string;
    group:       Group;
    description: string;
}

export enum Group {
    BasicAttack = "Basic Attack",
    ForteCircuit = "Forte Circuit",
    InherentSkill = "Inherent Skill",
    IntroSkill = "Intro Skill",
    OutroSkill = "Outro Skill",
    ResonanceChain = "Resonance Chain",
    ResonanceLiberation = "Resonance Liberation",
    ResonanceSkill = "Resonance Skill",
}

export interface Stat {
    stat: string;
}
