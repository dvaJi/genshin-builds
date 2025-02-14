import { Badge } from "@app/components/ui/badge";
import Image from "@components/genshin/Image";
import { capitalize } from "@utils/capitalize";

type Props = {
  weaponType: {
    id: string;
    name: string;
  };
};
export function WeaponTypeBadge({ weaponType }: Props) {
  return (
    <Badge variant="secondary" className="text-xs sm:text-sm">
      <Image
        src={`/weapons_type/${capitalize(weaponType.id)}.png`}
        alt={weaponType.name}
        className="mr-1"
        width={16}
        height={16}
      />
      {weaponType.name}
    </Badge>
  );
}
