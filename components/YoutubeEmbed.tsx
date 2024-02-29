"use client";

import { useMobileDetect } from "@hooks/use-mobile-detect";

interface Props {
  id: string;
}

const YoutubeEmbed = ({ id }: Props) => {
  const { isMobile, isLargeDesktop, innerWidth } = useMobileDetect();
  let sizes = {
    width: isMobile ? innerWidth - 30 : 560,
    height: isMobile ? innerWidth / 2 : 315,
  };

  if (isLargeDesktop) {
    sizes = {
      width: 730,
      height: 400,
    };
  }
  return (
    <iframe
      width={sizes.width}
      height={sizes.height}
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video player"
      frameBorder={0}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default YoutubeEmbed;
