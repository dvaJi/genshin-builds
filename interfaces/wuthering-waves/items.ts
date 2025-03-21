export interface Items {
  _id: number;
  id: string;
  name: string;
  rarity: number;
  type: Type;
  tag: Source[];
  desc?: string;
  bg?: string;
  icon: string;
  iconPath: IconPath;
  source: Source[];
}

export enum IconPath {
  UIUIResourcesCommonImageIconA = "/UI/UIResources/Common/Image/IconA/",
  UIUIResourcesCommonImageIconC = "/UI/UIResources/Common/Image/IconC/",
  UIUIResourcesCommonImageIconCook = "/UI/UIResources/Common/Image/IconCook/",
  UIUIResourcesCommonImageIconGiftPack = "/UI/UIResources/Common/Image/IconGiftPack/",
  UIUIResourcesCommonImageIconMonsterHead = "/UI/UIResources/Common/Image/IconMonsterHead/",
  UIUIResourcesCommonImageIconMout = "/UI/UIResources/Common/Image/IconMout/",
  UIUIResourcesCommonImageIconMst = "/UI/UIResources/Common/Image/IconMst/",
  UIUIResourcesCommonImageIconRouge = "/UI/UIResources/Common/Image/IconRouge/",
  UIUIResourcesCommonImageIconRup = "/UI/UIResources/Common/Image/IconRup/",
  UIUIResourcesCommonImageIconTask = "/UI/UIResources/Common/Image/IconTask/",
  UIUIResourcesCommonImageIconWeapon = "/UI/UIResources/Common/Image/IconWeapon/",
  UIUIResourcesCommonImageIconWup = "/UI/UIResources/Common/Image/IconWup/",
}

export interface Source {
  id: number;
  name: string;
}

export interface Type {
  id: number;
  icon: Icon;
  name?: Name;
}

export enum Icon {
  Empty = "",
  SPInventoryIconPag01 = "SP_InventoryIconPag01",
  SPInventoryIconPag02 = "SP_InventoryIconPag02",
  SPInventoryIconPag03 = "SP_InventoryIconPag03",
  SPInventoryIconPag04 = "SP_InventoryIconPag04",
  SPInventoryIconPag06 = "SP_InventoryIconPag06",
  SPInventoryIconPag07 = "SP_InventoryIconPag07",
  SPInventoryIconPag08 = "SP_InventoryIconPag08",
}

export enum Name {
  DevelopmentMaterials = "Development Materials",
  Echoes = "Echoes",
  QuestItems = "Quest Items",
  Resources = "Resources",
  Supplies = "Supplies",
  Valuables = "Valuables",
  Weapons = "Weapons",
}
