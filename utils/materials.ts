import { getGenshinData } from "@lib/dataApi";
import type {
  CommonMaterial,
  ElementalStoneMaterial,
  ExpMaterial,
  JewelMaterial,
  LocalMaterial,
  TalentLvlUpMaterial,
  WeaponPrimaryMaterial,
  WeaponSecondaryMaterial,
} from "@interfaces/genshin";

export type Material = {
  id: string;
  name: string;
  rarity: number;
  type: string;
};

export const allTypes = [
  "materials",
  "common_materials",
  "elemental_stone_materials",
  "jewels_materials",
  "local_materials",
  "talent_lvl_up_materials",
  "weapon_primary_materials",
  "weapon_secondary_materials",
];

export async function getAllMaterialsMap(language: string): Promise<Record<string, Material>> {
  const characterExpMaterials = await getGenshinData<ExpMaterial[]>({
    resource: "characterExpMaterials",
    select: ["id", "name", "rarity"],
    language,
  });
  const commonMaterials = await getGenshinData<CommonMaterial[]>({
    resource: "commonMaterials",
    select: ["id", "name", "rarity"],
    language,
  });
  const elementalStoneMaterials = await getGenshinData<
    ElementalStoneMaterial[]
  >({
    resource: "elementalStoneMaterials",
    select: ["id", "name", "rarity"],
    language,
  });
  const jewelsMaterials = await getGenshinData<JewelMaterial[]>({
    resource: "jewelsMaterials",
    select: ["id", "name", "rarity"],
    language,
  });
  const localMaterials = await getGenshinData<LocalMaterial[]>({
    resource: "localMaterials",
    select: ["id", "name"],
    language,
  });
  const talentLvlUpMaterials = await getGenshinData<TalentLvlUpMaterial[]>({
    resource: "talentLvlUpMaterials",
    select: ["id", "name", "rarity"],
    language,
  });
  const weaponExpMaterials = await getGenshinData<ExpMaterial[]>({
    resource: "weaponExpMaterials",
    select: ["id", "name", "rarity"],
    language,
  });
  const weaponPrimaryMaterials = await getGenshinData<WeaponPrimaryMaterial[]>({
    resource: "weaponPrimaryMaterials",
    select: ["id", "name", "rarity"],
    language,
  });
  const weaponSecondaryMaterials = await getGenshinData<
    WeaponSecondaryMaterial[]
  >({
    resource: "weaponSecondaryMaterials",
    select: ["id", "name", "rarity"],
    language,
  });

  const materialsMap: any = {};
  // iterate through all materials arrays
  characterExpMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "materials",
    };
  });

  commonMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "common_materials",
    };
  });

  elementalStoneMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "elemental_stone_materials",
    };
  });

  jewelsMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "jewels_materials",
    };
  });

  localMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: 1,
      type: "local_materials",
    };
  });

  talentLvlUpMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "talent_lvl_up_materials",
    };
  });

  weaponExpMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "materials",
    };
  });

  weaponPrimaryMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "weapon_primary_materials",
    };
  });

  weaponSecondaryMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "weapon_secondary_materials",
    };
  });

  materialsMap["mora"] = {
    name: "Mora",
    rarity: 1,
    type: "materials",
  };

  return materialsMap;
}
