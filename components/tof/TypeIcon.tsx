import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { TOF_IMGS_CDN } from "@lib/constants";

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
  <LazyLoadImage
    src={`${TOF_IMGS_CDN}/icons/${type.toLowerCase()}.png`}
    alt={type}
    className={className}
    width={width}
    height={height}
  />
);

export default memo(TypeIcon);
