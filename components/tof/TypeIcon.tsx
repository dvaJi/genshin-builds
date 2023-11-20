import { memo } from "react";

import { getTofUrl } from "@lib/imgUrl";

interface ElementIconProps {
  type: string;
  width?: number;
  height?: number;
  className?: string;
}

const TypeIcon = ({
  type,
  width = 64,
  height = 64,
  className,
}: ElementIconProps) => (
  <img
    src={getTofUrl(`/icons/${type.toLowerCase()}.png`, height, width)}
    alt={type}
    className={className}
    width={width}
    height={height}
  />
);

export default memo(TypeIcon);
