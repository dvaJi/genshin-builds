export interface LightCone {
  _id: number;
  id: string;
  name: string;
  desc: string;
  rarity: number;
  pathType: string;
  pathTypeText: string;
  effectName: string;
  effectTemplate: string;
  superImpositions: SuperImposition[];
  ascend: LightconeAscend[];
}

export interface LightconeAscend {
  promotion: number;
  maxLevel: number;
  levelReq?: number;
  attackBase: number;
  attackAdd: number;
  hpBase: number;
  hpAdd: number;
  defenseBase: number;
  defenseAdd: number;
  materials: Material[];
}

export interface Material {
  _id: number;
  id: string;
  name: string;
  amount: number;
}

export interface SuperImposition {
  rank: number;
  params: string[];
}
