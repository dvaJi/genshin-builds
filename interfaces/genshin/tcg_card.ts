import { CommonMaterial } from "./common_material";
import { ElementalStoneMaterial } from "./elemental_stone_material";
import { JewelMaterial } from "./jewel_material";
import { LocalMaterial } from "./local_material";
import { Potion } from "./potion";
import { TalentLvlUpMaterial } from "./talent_lvl_up_material";
import { TCGActionCard } from "./tcg_action";
import { TCGCharacterCard } from "./tcg_character";
import { TCGMonsterCard } from "./tcg_monster";
import { WeaponPrimaryMaterial } from "./weapon_primary_material";
import { WeaponSecondaryMaterial } from "./weapon_secondary_material";

export type Material =
  | CommonMaterial
  | ElementalStoneMaterial
  | JewelMaterial
  | LocalMaterial
  | Potion
  | TalentLvlUpMaterial
  | WeaponPrimaryMaterial
  | WeaponSecondaryMaterial;

export type TCGCard = TCGCharacterCard & TCGActionCard & TCGMonsterCard;
