import Image from "next/image";
import { memo } from "react";

interface ElementIconProps {
  type: string;
  width?: number;
  height?: number;
  className?: string;
}

const ElementIcon = ({
  type,
  width = 64,
  height = 64,
  className,
}: ElementIconProps) => (
  <Image
    src={`/elements/${type}.png`}
    alt={type}
    className={className}
    width={width}
    height={height}
  />
);
export default memo(ElementIcon);
