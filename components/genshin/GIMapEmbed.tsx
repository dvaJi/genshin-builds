import { useMobileDetect } from "@hooks/use-mobile-detect";

interface Props {
  mapIds: string[];
}

const GIMapEmbed = ({ mapIds }: Props) => {
  const { isMobile, isLargeDesktop, innerWidth } = useMobileDetect();
  let sizes = {
    width: isMobile ? innerWidth - 30 : 560,
    height: isMobile ? innerWidth : 315,
  };

  if (isLargeDesktop) {
    sizes = {
      width: 1000,
      height: 600,
    };
  }
  return (
    <iframe
      src={`https://genshin-impact-map.appsample.com/location?no_heading=1&names=${mapIds.join(
        ","
      )}`}
      height={sizes.height}
      width={sizes.width}
      frameBorder="0"
    />
  );
};

export default GIMapEmbed;
