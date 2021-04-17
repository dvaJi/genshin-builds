import clsx from "clsx";
import { memo } from "react";

type Props = {
  img: string;
  rarity: number;
  name: string;
  size?: number;
  className?: string;
};

const SimpleRarityBox = ({
  name,
  img,
  rarity,
  size = 24,
  className,
}: Props) => {
  return (
    <div
      className={clsx(
        `relative block w-14 h-14 lg:w-${size} lg:h-${size} m-1 bg-cover overflow-hidden text-center rounded group`,
        className
      )}
      style={{
        backgroundImage: `url(/_assets/bg_${rarity}star.png)`,
      }}
    >
      <img className="group-hover:opacity-70" src={img} alt={name} />
      <span
        className="absolute inline-block bottom-0 text-xs bg-gray-900 bg-opacity-90 rounded rounded-t-none p-1 transition-all opacity-80 group-hover:text-white group-hover:opacity-100"
        style={{ width: "calc(100% + 2px)", left: -2 }}
      >
        {name}
      </span>
    </div>
  );
};

export default memo(SimpleRarityBox);
