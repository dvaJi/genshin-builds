export interface Characters {
    _id:         number;
    id:          string;
    name:        string;
    nickname:    string;
    description: string;
    rarity:      number;
    weapon:      Element;
    element:     Element;
    icon:        string;
    bg:          string;
    tag:         { [key: string]: Tag };
    info:        Info;
    story:       Story[];
    voices:      Voice[];
    goods:       Good[];
    specialCook: SpecialCook | null;
    stats:       { [key: string]: { [key: string]: Stat } };
    levelEXP:    number[];
    skillTrees:  { [key: string]: SkillTree };
    chains:      Chain[];
    ascensions:  Array<Ascension[]>;
}

export interface Ascension {
    _id:    number;
    id:     ID;
    name:   Name;
    icon:   Icon;
    rarity: number;
    value:  number;
}

export enum Icon {
    TIconAHsbUI = "T_IconA_hsb_UI",
    TIconC029_UI = "T_IconC_029_UI",
    TIconC030_UI = "T_IconC_030_UI",
    TIconCDenglongguoUI = "T_IconC_denglongguo_UI",
    TIconCHuiYanGuUI = "T_IconC_HuiYanGu_UI",
    TIconCSep061_UI = "T_IconC_Sep_061_UI",
    TIconMout005_UI = "T_IconMout_005_UI",
    TIconMoutE002_1_UI = "T_IconMout_E_002_1_UI",
    TIconMoutE002_2_UI = "T_IconMout_E_002_2_UI",
    TIconMoutE002_3_UI = "T_IconMout_E_002_3_UI",
    TIconMoutE002_4_UI = "T_IconMout_E_002_4_UI",
    TIconMoutL001_1_UI = "T_IconMout_L_001_1_UI",
    TIconMoutL002_1_UI = "T_IconMout_L_002_1_UI",
    TIconMoutL003_1_UI = "T_IconMout_L_003_1_UI",
    TIconMoutL004_1_UI = "T_IconMout_L_004_1_UI",
    TIconMoutL006_UI = "T_IconMout_L_006_UI",
    TIconMoutL007_UI = "T_IconMout_L_007_UI",
    TIconMoutL008_UI = "T_IconMout_L_008_UI",
    TIconMoutL009_UI = "T_IconMout_L_009_UI",
    TIconMoutL010_UI = "T_IconMout_L_010_UI",
    TIconMoutL011_UI = "T_IconMout_L_011_UI",
    TIconMoutL012_UI = "T_IconMout_L_012_UI",
    TIconMoutL013_UI = "T_IconMout_L_013_UI",
    TIconMoutL014_UI = "T_IconMout_L_014_UI",
    TIconMoutL015_UI = "T_IconMout_L_015_UI",
    TIconMoutO002_1_UI = "T_IconMout_O_002_1_UI",
    TIconMoutO002_2_UI = "T_IconMout_O_002_2_UI",
    TIconMoutO002_3_UI = "T_IconMout_O_002_3_UI",
    TIconMoutO002_4_UI = "T_IconMout_O_002_4_UI",
    TIconMoutO003_1_UI = "T_IconMout_O_003_1_UI",
    TIconMoutO003_2_UI = "T_IconMout_O_003_2_UI",
    TIconMoutO003_3_UI = "T_IconMout_O_003_3_UI",
    TIconMoutO003_4_UI = "T_IconMout_O_003_4_UI",
    TIconRupSMGat18AUI = "T_IconRup_SM_Gat_18A_UI",
    TIconRupSMGat29AUI = "T_IconRup_SM_Gat_29A_UI",
    TIconRupSMGat30AUI = "T_IconRup_SM_Gat_30A_UI",
    TIconRupSMGat31AUI = "T_IconRup_SM_Gat_31A_UI",
    TIconRupSMGat33AUI = "T_IconRup_SM_Gat_33A_UI",
    TIconTaskTask084_UI = "T_IconTask_Task_084_UI",
    TIconWup005_UI = "T_IconWup_005_UI",
    TIconWup006_UI = "T_IconWup_006_UI",
    TIconWup007_UI = "T_IconWup_007_UI",
    TIconWup008_UI = "T_IconWup_008_UI",
    TIconWup009_UI = "T_IconWup_009_UI",
    TIconWup010_UI = "T_IconWup_010_UI",
    TIconWup011_UI = "T_IconWup_011_UI",
    TIconWup012_UI = "T_IconWup_012_UI",
    TIconWup013_UI = "T_IconWup_013_UI",
    TIconWup014_UI = "T_IconWup_014_UI",
    TIconWup015_UI = "T_IconWup_015_UI",
    TIconWup016_UI = "T_IconWup_016_UI",
    TIconWup01_UI = "T_IconWup_01_UI",
    TIconWup02_UI = "T_IconWup_02_UI",
    TIconWup03_UI = "T_IconWup_03_UI",
    TIconWup04_UI = "T_IconWup_04_UI",
    TIconWupSetpup004_1_UI = "T_IconWup_Setpup_004_1_UI",
    TIconWupSetpup004_2_UI = "T_IconWup_Setpup_004_2_UI",
    TIconWupSetpup004_3_UI = "T_IconWup_Setpup_004_3_UI",
    TIconWupSetpup004_4_UI = "T_IconWup_Setpup_004_4_UI",
}

export enum ID {
    AdagioHelix = "adagio_helix",
    AndanteHelix = "andante_helix",
    BasicRing = "basic_ring",
    BellePoppy = "belle_poppy",
    CadenceBlossom = "cadence_blossom",
    CadenceBud = "cadence_bud",
    CadenceLeaf = "cadence_leaf",
    CadenceSeed = "cadence_seed",
    Coriolus = "coriolus",
    CrudeRing = "crude_ring",
    DreamlessFeather = "dreamless_feather",
    ElegyTacetCore = "elegy_tacet_core",
    ExtractedPhlogiston = "extracted_phlogiston",
    FfHowlerCore = "ff_howler_core",
    FfWhisperinCore = "ff_whisperin_core",
    FlawlessPhlohiston = "flawless_phlohiston",
    GolddissolvingFeather = "golddissolving_feather",
    GroupAbominationTacetCore = "group_abomination_tacet_core",
    HFHowlerCore = "hf_howler_core",
    HFWhisperinCore = "hf_whisperin_core",
    HeterizedMetallicDrip = "heterized_metallic_drip",
    HiddenThunderTacetCore = "hidden_thunder_tacet_core",
    ImprovedRing = "improved_ring",
    ImpurePhlogiston = "impure_phlogiston",
    InertMetallicDrip = "inert_metallic_drip",
    Iris = "iris",
    LFHowlerCore = "lf_howler_core",
    LFWhisperinCore = "lf_whisperin_core",
    Lanternberry = "lanternberry",
    LentoHelix = "lento_helix",
    LoongsPearl = "loongs_pearl",
    MFHowlerCore = "mf_howler_core",
    MFWhisperinCore = "mf_whisperin_core",
    MonumentBell = "monument_bell",
    MysteriousCode = "mysterious_code",
    Nova = "nova",
    PavoPlum = "pavo_plum",
    PecokFlower = "pecok_flower",
    PolarizedMetallicDrip = "polarized_metallic_drip",
    PrestoHelix = "presto_helix",
    RageTacetCore = "rage_tacet_core",
    ReactiveMetallicDrip = "reactive_metallic_drip",
    RefinedPhlohiston = "refined_phlohiston",
    RoaringRockFist = "roaring_rock_fist",
    SentinelsDagger = "sentinels_dagger",
    ShellCredit = "shell_credit",
    SoundkeepingTacetCore = "soundkeeping_tacet_core",
    StrifeTacetCore = "strife_tacet_core",
    TailoredRing = "tailored_ring",
    TerraspawnFungus = "terraspawn_fungus",
    ThunderingTacetCore = "thundering_tacet_core",
    TopologicalConfinement = "topological_confinement",
    UnendingDestruction = "unending_destruction",
    VioletCoral = "violet_coral",
    WavewornResidue210 = "waveworn_residue_210",
    WavewornResidue226 = "waveworn_residue_226",
    WavewornResidue235 = "waveworn_residue_235",
    WavewornResidue239 = "waveworn_residue_239",
    WintryBell = "wintry_bell",
}

export enum Name {
    AdagioHelix = "Adagio Helix",
    AndanteHelix = "Andante Helix",
    BasicRing = "Basic Ring",
    BellePoppy = "Belle Poppy",
    CadenceBlossom = "Cadence Blossom",
    CadenceBud = "Cadence Bud",
    CadenceLeaf = "Cadence Leaf",
    CadenceSeed = "Cadence Seed",
    Coriolus = "Coriolus",
    CrudeRing = "Crude Ring",
    DreamlessFeather = "Dreamless Feather",
    ElegyTacetCore = "Elegy Tacet Core",
    ExtractedPhlogiston = "Extracted Phlogiston",
    FFHowlerCore = "FF Howler Core",
    FFWhisperinCore = "FF Whisperin Core",
    FlawlessPhlohiston = "Flawless Phlohiston",
    GoldDissolvingFeather = "Gold-Dissolving Feather",
    GroupAbominationTacetCore = "Group Abomination Tacet Core",
    HFHowlerCore = "HF Howler Core",
    HFWhisperinCore = "HF Whisperin Core",
    HeterizedMetallicDrip = "Heterized Metallic Drip",
    HiddenThunderTacetCore = "Hidden Thunder Tacet Core",
    ImprovedRing = "Improved Ring",
    ImpurePhlogiston = "Impure Phlogiston",
    InertMetallicDrip = "Inert Metallic Drip",
    Iris = "Iris",
    LFHowlerCore = "LF Howler Core",
    LFWhisperinCore = "LF Whisperin Core",
    Lanternberry = "Lanternberry",
    LentoHelix = "Lento Helix",
    LoongSPearl = "Loong's Pearl",
    MFHowlerCore = "MF Howler Core",
    MFWhisperinCore = "MF Whisperin Core",
    MonumentBell = "Monument Bell",
    MysteriousCode = "Mysterious Code",
    Nova = "Nova",
    PavoPlum = "Pavo Plum",
    PecokFlower = "Pecok Flower",
    PolarizedMetallicDrip = "Polarized Metallic Drip",
    PrestoHelix = "Presto Helix",
    RageTacetCore = "Rage Tacet Core",
    ReactiveMetallicDrip = "Reactive Metallic Drip",
    RefinedPhlohiston = "Refined Phlohiston",
    RoaringRockFist = "Roaring Rock Fist",
    SentinelSDagger = "Sentinel's Dagger",
    ShellCredit = "Shell Credit",
    SoundKeepingTacetCore = "Sound-Keeping Tacet Core",
    StrifeTacetCore = "Strife Tacet Core",
    TailoredRing = "Tailored Ring",
    TerraspawnFungus = "Terraspawn Fungus",
    ThunderingTacetCore = "Thundering Tacet Core",
    TopologicalConfinement = "Topological Confinement",
    UnendingDestruction = "Unending Destruction",
    VioletCoral = "Violet Coral",
    WavewornResidue210 = "Waveworn Residue 210",
    WavewornResidue226 = "Waveworn Residue 226",
    WavewornResidue235 = "Waveworn Residue 235",
    WavewornResidue239 = "Waveworn Residue 239",
    WintryBell = "Wintry Bell",
}

export interface Chain {
    name:     string;
    desc:     string;
    param:    string[];
    icon:     string;
    iconPath: IconPath;
}

export enum IconPath {
    UIUIResourcesCommonImageIconDevice = "/UI/UIResources/Common/Image/IconDevice/",
}

export interface Element {
    id:   number;
    name: string;
    icon: string;
}

export interface Good {
    title:   string;
    content: string;
    icon:    string;
}

export interface Info {
    birth:               string;
    sex:                 Sex;
    country:             Country;
    influence:           string;
    info:                string;
    talentName:          string;
    talentDoc:           string;
    talentCertification: string;
    cvNameCn:            string;
    cvNameJp:            string;
    cvNameKo:            string;
    cvNameEn:            string;
}

export enum Country {
    Huanglong = "Huanglong",
    NewFederation = "New Federation",
    TheBlackShores = "The Black Shores",
    Unknown = "Unknown",
}

export enum Sex {
    Female = "Female",
    Male = "Male",
}

export interface SkillTree {
    nodeIndex:   number;
    parentNodes: number[];
    nodeType:    number;
    coordinate:  number;
    consume:     Consume[];
    skillId:     number;
    skill:       Skill;
}

export interface Consume {
    Key:   number;
    Value: number;
}

export interface Skill {
    name:     string;
    desc:     string;
    param:    string[];
    iconPath: string;
    icon:     string;
    type:     Type;
    level:    Level[];
    consume:  { [key: string]: Ascension[] };
    damage:   Damage[];
}

export interface Damage {
    element:         number;
    relatedProperty: RelatedProperty;
    type:            number;
    rateLv:          number[];
    energy:          number;
    elementPower:    number;
    hardnessLv:      number;
    toughLv:         number;
}

export enum RelatedProperty {
    Atk = "ATK",
    CritRate = "Crit. Rate",
    HP = "HP",
    Level = "Level",
    Shield = "Shield",
    ShieldBreakRate = "Shield Break Rate",
}

export interface Level {
    name:   string;
    param:  Array<string[]>;
    format: null;
}

export enum Type {
    ForteCircuit = "Forte Circuit",
    InherentSkill = "Inherent Skill",
    IntroSkill = "Intro Skill",
    NormalAttack = "Normal Attack",
    OutroSkill = "Outro Skill",
    ResonanceLiberation = "Resonance Liberation",
    ResonanceSkill = "Resonance Skill",
}

export interface SpecialCook {
    id:     number;
    name:   string;
    effect: string;
    icon:   string;
    rarity: number;
}

export interface Stat {
    Life: number;
    Atk:  number;
    Def:  number;
}

export interface Story {
    title:   string;
    content: string;
}

export interface Tag {
    id:    number;
    name:  string;
    desc:  string;
    icon:  string;
    color: Color;
}

export enum Color {
    Ff4040 = "ff4040",
    Ff7777 = "ff7777",
    Ff8441 = "ff8441",
    Ffde73 = "ffde73",
    The77Adff = "77adff",
    The77Ffb7 = "77ffb7",
}

export interface Voice {
    type:    number;
    title:   string;
    content: string;
}
