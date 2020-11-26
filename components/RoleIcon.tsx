import { memo } from "react";

import { GiCherish, GiCrossedSwords, GiBroadsword } from "react-icons/gi";

const RoleIcon = ({
  role,
  ...props
}: { role: string } & React.HTMLAttributes<SVGElement>) => {
  switch (role) {
    case "Utility":
      return <GiCherish {...props} />;

    case "Sub DPS":
      return <GiCrossedSwords {...props} />;

    case "Main DPS":
      return <GiBroadsword {...props} />;

    default:
      return <GiBroadsword {...props} />;
  }
};

export default memo(RoleIcon);
