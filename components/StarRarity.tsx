"use client";

import clsx from "clsx";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getUrl } from "@lib/imgUrl";

interface StarRarityProps {
  rarity: number;
  starsSize?: number;
  className?: string;
  starClassname?: string;
}

const StarRarity = ({
  rarity,
  starsSize = 24,
  className,
  starClassname,
}: StarRarityProps) => {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      {[...Array(rarity)].map((_, i) => (
        <div
          key={i}
          style={{ "--star-delay": `${i * 50}ms` } as React.CSSProperties}
          className={clsx(
            "transform transition-transform duration-300",
            "hover:scale-125 hover:brightness-125",
            "animate-[starPop_500ms_ease-out_forwards]",
            "[animation-delay:var(--star-delay)]",
            "-ml-0.5 first:ml-0",
            starClassname,
          )}
        >
          <LazyLoadImage
            src={getUrl(`/1_star.png`)}
            alt="star"
            width={starsSize}
            height={starsSize}
            className="drop-shadow-[0_2px_3px_rgba(222,184,100,0.4)]"
          />
        </div>
      ))}
    </div>
  );
};

export default memo(StarRarity);
