import clsx from "clsx";
import Link from "next/link";

import Image from "@components/wuthering-waves/Image";

type Props = {
  lang: string;
  item: {
    _id: number;
    icon: string;
    value: number;
    name: string;
    rarity: number;
  };
  showValue?: boolean;
};

const rText = ["", "one", "two", "three", "four", "five"];

export default function Material({ lang, item, showValue = true }: Props) {
  return (
    <div className="flex items-end justify-center">
      <Link
        href={`/${lang}/wuthering-waves/items/${item._id}`}
        className={clsx(
          "relative m-1 rounded transition-all hover:brightness-125",
          `${rText[item.rarity]}-star-bg`
        )}
      >
        <Image
          src={`/items/${item.icon}.webp`}
          alt={item.name}
          title={item.name}
          width={85}
          height={85}
        />
      </Link>
      {showValue ? (
        <div className="absolute transform rounded bg-ww-950 px-1">
          {item.value}
        </div>
      ) : null}
    </div>
  );
}
