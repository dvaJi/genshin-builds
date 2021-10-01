import clsx from "clsx";
import { memo, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { IMGS_CDN } from "@lib/constants";

interface StarRarityProps {
  rarity: number;
  starsSize?: number;
  className?: string;
  starClassname?: string;
}

const StarRarity = ({
  className,
  starClassname,
  rarity = 1,
  starsSize = 33,
}: StarRarityProps) => {
  const starts = useMemo(() => {
    let N = rarity,
      i = 0,
      a = Array(N);

    while (i < N) a[i++] = i;
    return a;
  }, [rarity]);
  return (
    <div
      className={clsx("flex items-center justify-items-center w-10", className)}
    >
      {starts.map((star) => (
        <div
          key={`star_${star}`}
          className={clsx("w-4 text-yellow-400", starClassname, {
            "-m-1": star > 0,
          })}
        >
          <LazyLoadImage
            src={`${IMGS_CDN}/1_star.png`}
            alt="1_star.png"
            width={starsSize}
            height={starsSize}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(StarRarity);
