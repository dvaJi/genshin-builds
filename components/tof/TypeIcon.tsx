import { memo } from "react";

import Image from "./Image";

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
  <Image
    src={`/icons/${type.toLowerCase()}.png`}
    alt={type}
    className={className}
    width={width}
    height={height}
  />
);

export default memo(TypeIcon);
