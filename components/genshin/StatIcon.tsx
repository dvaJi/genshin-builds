import { getUrl } from "@lib/imgUrl";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
    <LazyLoadImage
      src={getUrl(
        `/stats/${iconName}.png`,
        Math.round(height * 1.05),
        Math.round(width * 1.05)
      )}
      alt={type}
      className={className}
      width={width}
      height={height}
    />
  );
};
export default memo(StatIcon);
