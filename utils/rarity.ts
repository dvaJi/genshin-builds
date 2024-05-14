export function getRarityColor(_rarity: number | string) {
  const rarity =
    typeof _rarity === "number" ? rarityToString(_rarity) : _rarity;
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

export function rarityToString(rarity: number) {
  switch (rarity) {
    case 5:
      return "SSR";
    case 4:
      return "SR";
    case 3:
      return "R";
    case 2:
      return "N";
    default:
      return "Unknown";
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
