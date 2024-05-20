"use client";

import { memo } from "react";

import Image from "./Image";

interface ElementIconProps {
  type: string;
  width?: number;
  height?: number;
  className?: string;
  asyncLoad?: boolean;
}

function ElementIcon({
  type,
  width = 64,
  height = 64,
  className,
  asyncLoad = true,
}: ElementIconProps) {
  return (
    <Image
      src={`/elements/${type}.png`}
      alt={type}
      className={className}
      width={width}
      height={height}
      loading={asyncLoad ? "lazy" : "eager"}
    />
  );
}

export default memo(ElementIcon);
