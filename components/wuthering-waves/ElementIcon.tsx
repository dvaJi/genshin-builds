"use client";

import { memo } from "react";

import Image from "./Image";

interface ElementIconProps {
  type: string;
  width?: number;
  height?: number;
  className?: string;
}

function ElementIcon({
  type,
  width = 64,
  height = 64,
  className,
}: ElementIconProps) {
  return (
    <Image
      src={`/icons/element_${type}.webp`}
      alt={`${type} element`}
      className={className}
      width={width}
      height={height}
    />
  );
}

export default memo(ElementIcon);
