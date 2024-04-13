import { memo } from "react";

import Image from "./Image";

interface Props {
  type: string;
  width?: number;
  height?: number;
  className?: string;
}

const StatIcon = ({ type, width = 64, height = 64, className }: Props) => {
  let iconName = type.toLowerCase().replaceAll(" ", "_").replace("%", "_per");

  switch (type) {
    case "anemo":
      iconName = "wind";
      break;
    default:
      break;
  }

  return (
    <Image
      src={`/stats/${iconName}.png`}
      alt={type}
      className={className}
      width={width}
      height={height}
    />
  );
};
export default memo(StatIcon);
