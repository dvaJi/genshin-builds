export interface PlayerDataAPI {
  playerInfo: PlayerAPI;
  avatarInfoList: CharactersAPI[];
  ttl: number;
  owner: OwnerAPI;
  uid: string;
}

export interface PlayerAPI {
  nickname: string;
  level: number;
  signature: string;
  worldLevel: number;
  nameCardId: number;
  finishAchievementNum: number;
  towerFloorIndex: number;
  towerLevelIndex: number;
  showAvatarInfoList: ShowcaseAPI[];
  showNameCardIdList: number[];
  profilePicture: ProfilePictureAPI & ProfilePictureAPINew;
}

export interface ShowcaseAPI {
  avatarId: number;
  level: number;
  costumeId: number;
}

export interface ProfilePictureAPI {
  avatarId: number;
  costumeId?: number;
}

export interface ProfilePictureAPINew {
  id: number;
}

export interface CharactersAPI {
  avatarId: number;
  propMap: PropertiesAPI;
  fightPropMap: StatsAPI;
  talentIdList: number[];
  skillDepotId: number;
  inherentProudSkillList: number[];
  skillLevelMap: object;
  equipList: (ArtifactAPI & WeaponAPI)[];
  fetterInfo: FriendshipAPI;
  costumeId: number;
  proudSkillExtraLevelMap: object;
}

export interface PropertiesAPI {
  1001: PropMapContentAPI;
  1002: PropMapContentAPI;
  4001: PropMapContentAPI;
  10010: PropMapContentAPI;
}

export interface PropMapContentAPI {
  type: number;
  val: string;
}

export interface StatsAPI {
  1: number;
  3: number;
  4: number;
  6: number;
  7: number;
  9: number;
  20: number;
  22: number;
  23: number;
  26: number;
  27: number;
  28: number;
  29: number;
  30: number;
  40: number;
  41: number;
  42: number;
  43: number;
  44: number;
  45: number;
  46: number;
  50: number;
  51: number;
  52: number;
  53: number;
  54: number;
  55: number;
  56: number;
  70: number;
  71: number;
  72: number;
  73: number;
  74: number;
  75: number;
  76: number;
  80: number;
  81: number;
  1000: number;
  1001: number;
  1002: number;
  1003: number;
  1004: number;
  1005: number;
  1006: number;
  1010: number;
  2000: number;
  2001: number;
  2002: number;
}

export interface ArtifactAPI {
  itemId: number;
  reliquary: ArtifactInfoAPI;
  flat: ArtifactFlatAPI;
}

interface ArtifactInfoAPI {
  level: number;
  mainPropId: number;
  appendPropIdList: number[];
}

interface ArtifactFlatAPI {
  nameTextMapHash: string;
  setNameTextMapHash: string;
  rankLevel: number;
  reliquaryMainstat: ArtifactMainstatAPI;
  reliquarySubstats: ArtifactSubstatsAPI[];
  itemType: string;
  icon: string;
  equipType: string;
}

interface ArtifactMainstatAPI {
  mainPropId: string;
  statValue: number;
}

export interface ArtifactSubstatsAPI {
  appendPropId: string;
  statValue: number;
}

export interface WeaponAPI {
  itemId: number;
  weapon: WeaponInfoAPI;
  flat: WeaponFlatAPI;
}

interface WeaponInfoAPI {
  level: number;
  promoteLevel: number;
  affixMap: object;
}

interface WeaponFlatAPI {
  nameTextMapHash: string;
  rankLevel: number;
  weaponStats: WeaponStatsAPI[];
  itemType: string;
  icon: string;
}

export interface WeaponStatsAPI {
  appendPropId: string;
  statValue: number;
}

export interface FriendshipAPI {
  expLevel: number;
}

export interface OwnerAPI {
  hash: string;
  username: string;
  profile: EnkaProfileDataAPI;
}

export interface EnkaProfileDataAPI {
  bio: string;
  level: number;
  signup_state: number;
  image_url: string;
}

export interface EnkaProfileAPI {
  username: string;
  profile: EnkaProfileDataAPI;
}

export interface HoyoAPI {
  uid_public: boolean;
  public: boolean;
  verified: boolean;
  uid: string;
  player_info: PlayerAPI;
  hash: string;
  region: string;
  order: number;
}

export interface HoyoBuildsAPI {
  id: number;
  name: string;
  avatar_id: string;
  avatar_data: CharactersAPI;
  order: number;
  live: boolean;
  settings: object;
  public: boolean;
}
