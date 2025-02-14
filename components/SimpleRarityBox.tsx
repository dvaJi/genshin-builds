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
  hideNameOnMobile?: boolean;
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
  hideNameOnMobile,
}: SimpleRarityBoxProps) => {
  return (
    <>
      <div
        className={clsx(
          "aspect-square overflow-hidden rounded-md",
          `genshin-bg-rarity-${rarity}`,
          className,
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
            <div
              className={clsx(
                "absolute inset-x-0 bottom-0",
                hideNameOnMobile ? "hidden sm:block" : "block",
                "bg-gradient-to-t from-black/80 to-transparent pb-1 pt-4",
              )}
            >
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
            "mt-1 block w-full truncate rounded-md bg-card/80 px-2 py-1 text-center text-xs text-card-foreground shadow-sm backdrop-blur-sm",
            classNameBlock,
            hideNameOnMobile && "hidden sm:block",
          )}
        >
          {name}
        </span>
      )}
    </>
  );
};

export default memo(SimpleRarityBox);
