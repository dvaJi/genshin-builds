import { IMGS_CDN } from "@lib/constants";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
  <LazyLoadImage
    src={`${IMGS_CDN}/elements/${type}.png`}
    alt={type}
    className={className}
    width={width}
    height={height}
  />
);
export default memo(ElementIcon);
