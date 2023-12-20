"use client";

import { getUrl } from "@lib/imgUrl";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
    <LazyLoadImage
      src={getUrl(`/elements/${type}.png`, height, width)}
      alt={type}
      className={className}
      width={width}
      height={height}
    />
  );
}

export default memo(ElementIcon);
