"use client";

import { memo } from "react";

import Image from "./Image";

interface Props {
  type: string;
  width?: number;
  height?: number;
  className?: string;
}

function TypeIcon({ type, width = 64, height = 64, className }: Props) {
  return (
    <Image
      src={`/icons/type_${type}.webp`}
      alt={`${type} type`}
      className={className}
      width={width}
      height={height}
    />
  );
}

export default memo(TypeIcon);
