import { Artifact } from "genshin-data";

export type BonusSet = Record<string, Artifact>;

export function getBonusSet(
  artifacts: Artifact[],
  dict: Record<string, string>,
  common: Record<string, string>
): BonusSet {
  let bonusSet: Record<string, any> = {};
  const ATK18BONUS = [
    "gladiators_finale",
    "shimenawas_reminiscence",
    "vermillion_hereafter",
    "echoes_of_an_offering",
  ];

  bonusSet["18atk_set"] = {
    ...artifacts.find((a) => a.id === ATK18BONUS[0])!,
    name: dict && dict["18atk_set"] ? dict["18atk_set"] : "ATK +18% set",
    children: artifacts.filter((a) => ATK18BONUS.includes(a.id)),
  };

  const Energy20BONUS = ["emblem_of_severed_fate", "the_exile", "scholar"];

  bonusSet["20energyrecharge_set"] = {
    ...artifacts.find((a) => a.id === Energy20BONUS[0])!,
    name:
      dict && dict["20energyrecharge_set"]
        ? dict["20energyrecharge_set"]
        : "Energy Recharge +20% set",
    children: artifacts.filter((a) => Energy20BONUS.includes(a.id)),
  };

  const Anemo15BONUS = ["viridescent_venerer", "desert_pavilion_chronicle"];

  bonusSet["15anemodmg_set"] = {
    ...artifacts.find((a) => a.id === Anemo15BONUS[0])!,
    name:
      dict && dict["15anemodmg_set"]
        ? dict["15anemodmg_set"]
        : "Anemo DMG Bonus +15% set",
    children: artifacts.filter((a) => Anemo15BONUS.includes(a.id)),
  };

  const Physical25BONUS = ["bloodstained_chivalry", "pale_flame", "scholar"];

  bonusSet["25physicaldmg_set"] = {
    ...artifacts.find((a) => a.id === Physical25BONUS[0])!,
    name:
      dict && dict["25physicaldmg_set"]
        ? dict["25physicaldmg_set"]
        : "Physical DMG +25% set",
    children: artifacts.filter((a) => Physical25BONUS.includes(a.id)),
  };

  const EM80BONUS = ["wanderers_troupe", "gilded_dreams", "instructor"];

  bonusSet["80elementalmastery_set"] = {
    ...artifacts.find((a) => a.id === EM80BONUS[0])!,
    name:
      dict && dict["80elementalmastery_set"]
        ? dict["80elementalmastery_set"]
        : "Elemental Mastery +80 set",
    children: artifacts.filter((a) => EM80BONUS.includes(a.id)),
  };

  const HEAL15BONUS = ["maiden_beloved", "oceanhued_clam"];

  bonusSet["15healingbonus_set"] = {
    ...artifacts.find((a) => a.id === HEAL15BONUS[0])!,
    name: common["Healing Bonus"]
      ? `${common["Healing Bonus"]} +15% set`
      : "Healing Bonus +15% set",
    children: artifacts.filter((a) => HEAL15BONUS.includes(a.id)),
  };

  const HP20BONUS = ["tenacity_of_the_millelith", "vourukashas_glow"];

  bonusSet["20hp_set"] = {
    ...artifacts.find((a) => a.id === HP20BONUS[0])!,
    name: common["HP"] ? `${common["HP"]} +20% set` : "HP +20% set",
    children: artifacts.filter((a) => HP20BONUS.includes(a.id)),
  };

  const HYDRO15BONUS = ["heart_of_depth", "nymphs_dream"];

  bonusSet["15hydrodmg_set"] = {
    ...artifacts.find((a) => a.id === HYDRO15BONUS[0])!,
    name: common["Hydro DMG"]
      ? `${common["Hydro DMG"]} +15% set`
      : "Hydro DMG +15% set",
    children: artifacts.filter((a) => HYDRO15BONUS.includes(a.id)),
  };

  bonusSet["others"] = {
    _id: -1,
    id: "others",
    name: dict && dict["others"] ? dict["others"] : "Others",
    max_rarity: 1,
    min_rarity: 1,
    two_pc: dict && dict["others_desc"] ? dict["others_desc"] : "Others",
  };

  return bonusSet;
}
