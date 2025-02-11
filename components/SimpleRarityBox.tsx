"use client";

import clsx from "clsx";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface SimpleRarityBoxProps {
  img: string;
  placeholderSrc?: string;
  rarity?: number;
  name?: string;
  alt?: string;
  className?: string;
  classNameBlock?: string;
  nameSeparateBlock?: boolean;
}

const SimpleRarityBox = ({
  img,
  placeholderSrc,
  rarity = 1,
  name,
  alt,
  className,
  classNameBlock,
  nameSeparateBlock = false,
}: SimpleRarityBoxProps) => {
  return (
    <>
      <div
        className={clsx(
          "aspect-square overflow-hidden rounded-lg",
          `genshin-bg-rarity-${rarity}`,
          className
        )}
      >
        <div className="group relative h-full w-full">
          <LazyLoadImage
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={img}
            placeholderSrc={placeholderSrc}
            alt={alt ?? name}
            title={alt ?? name}
            loading="lazy"
            draggable="false"
          />

          {!nameSeparateBlock && name && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pb-1 pt-4">
              <span className="block text-center text-xs font-medium text-white">
                {name}
              </span>
            </div>
          )}
        </div>
      </div>
      {nameSeparateBlock && name && (
        <span
          className={clsx(
            "bg-card/80 text-card-foreground mt-1 block w-full truncate rounded-md px-2 py-1 text-center text-xs shadow-sm backdrop-blur-sm",
            classNameBlock
          )}
        >
          {name}
        </span>
      )}
    </>
  );
};

export default memo(SimpleRarityBox);
