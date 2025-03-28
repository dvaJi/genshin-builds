export interface PlayerDataAPI {
  PlayerInfo: PlayerInfo;
  uid: string;
  ttl: number;
}

export interface PlayerInfo {
  ShowcaseDetail: ShowcaseDetail;
  SocialDetail: SocialDetail;
}

export interface ShowcaseDetail {
  AvatarList: AvatarList[];
}

export interface AvatarList {
  WeaponEffectState: number;
  EquippedList: EquippedList[];
  SkillLevelList: SkillLevelList[];
  TalentToggleList: boolean[];
  ClaimedRewardList: number[];
  IsHidden: boolean;
  Id: number;
  Level: number;
  PromotionLevel: number;
  Exp: number;
  SkinId: number;
  TalentLevel: number;
  WeaponUid: number;
  CoreSkillEnhancement: number;
  ObtainmentTimestamp: number;
  Weapon: Weapon;
}

export interface EquippedList {
  Slot: number;
  Equipment: Equipment;
}

export interface Equipment {
  MainPropertyList: PropertyList[];
  RandomPropertyList: PropertyList[];
  IsAvailable: boolean;
  IsLocked: boolean;
  IsTrash: boolean;
  Id: number;
  Uid: number;
  Level: number;
  BreakLevel: number;
  Exp: number;
}

export interface PropertyList {
  PropertyId: number;
  PropertyLevel: number;
  PropertyValue: number;
}

export interface SkillLevelList {
  Level: number;
  Index: number;
}

export interface Weapon {
  IsAvailable: boolean;
  IsLocked: boolean;
  Id: number;
  Uid: number;
  Level: number;
  BreakLevel: number;
  Exp: number;
  UpgradeLevel: number;
}

export interface SocialDetail {
  MedalList: MedalList[];
  ProfileDetail: ProfileDetail;
  Desc: string;
}

export interface MedalList {
  Value: number;
  MedalIcon: number;
  MedalType: number;
}

export interface ProfileDetail {
  Nickname: string;
  AvatarId: number;
  Uid: number;
  Level: number;
  Title: number;
  ProfileId: number;
  PlatformType: number;
  CallingCardId: number;
}
