export function getRarityColor(rarity: string) {
  switch (rarity) {
    case "SSR":
      return "text-yellow-200";
    case "SR":
      return "text-purple-500";
    case "R":
      return "text-blue-400";
    case "N":
      return "text-green-400";
    default:
      return "text-white";
  }
}

export function rarityToNumber(rarity: string) {
  // SSR is higer and N is lower
  switch (rarity) {
    case "SSR":
      return 4;
    case "SR":
      return 3;
    case "R":
      return 2;
    case "N":
      return 1;
    default:
      return 0;
  }
}
