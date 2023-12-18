"use client";

import clsx from "clsx";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

type Props = {
  img: string;
  rarity: number;
  placeholderSrc?: string;
  name?: string;
  size?: number;
  alt?: string;
  className?: string;
  nameSeparateBlock?: boolean;
  classNameBlock?: string;
};

const SimpleRarityBox = ({
  name,
  alt,
  img,
  rarity = 0,
  className,
  nameSeparateBlock = false,
  placeholderSrc,
  classNameBlock,
}: Props) => {
  const imgAdditionalStyle = nameSeparateBlock
    ? "mb-0 rounded rounded-b-none"
    : "";
  return (
    <>
      <div
        className={clsx(
          `group relative m-1 block overflow-hidden rounded text-center`,
          imgAdditionalStyle,
          `genshin-bg-rarity-${rarity}`,
          className
        )}
      >
        <LazyLoadImage
          className="group-hover:opacity-70"
          src={img}
          placeholderSrc={placeholderSrc}
          alt={alt ?? name}
          title={alt ?? name}
          loading="lazy"
          draggable="false"
        />

        {!nameSeparateBlock && name && (
          <span className="absolute bottom-0 left-0 inline-block w-full rounded-sm rounded-t-none bg-gray-900 bg-opacity-90 p-1 text-xs opacity-80 transition-all group-hover:text-white group-hover:opacity-100">
            {name}
          </span>
        )}
      </div>
      {nameSeparateBlock && name && (
        <span
          className={clsx(
            "m-1 mt-0 inline-block overflow-hidden rounded rounded-t-none bg-vulcan-900 bg-opacity-90 p-1 text-center text-xs",
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
