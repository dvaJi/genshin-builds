import { memo } from "react";

import {
  GiBroadsword,
  GiCrocSword,
  GiPocketBow,
  GiSpellBook,
  GiSpearHook,
} from "react-icons/gi";

const WeaponIcon = ({
  weapon,
  ...props
}: { weapon: string } & React.HTMLAttributes<SVGElement>) => {
  switch (weapon) {
    case "Sword":
      return <GiBroadsword {...props} />;

    case "Claymore":
      return <GiCrocSword {...props} />;

    case "Bow":
      return <GiPocketBow {...props} />;

    case "Catalyst":
      return <GiSpellBook {...props} />;

    case "Polearm":
      return <GiSpearHook {...props} />;

    default:
      return <GiBroadsword {...props} />;
  }
};

export default memo(WeaponIcon);
