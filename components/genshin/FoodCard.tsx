import clsx from "clsx";
import Link from "next/link";
import { memo } from "react";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";

import SimpleRarityBox from "../SimpleRarityBox";
import StarRarity from "../StarRarity";
import Image from "./Image";

interface FoodCardProps {
  item: any;
}

const FoodCard = ({ item }: FoodCardProps) => {
  const { locale } = useIntl("food");
  return (
    <div className="mb-2 flex flex-col rounded border border-vulcan-700 bg-vulcan-800">
      <div className="flex h-full flex-row">
        <div
          className={clsx(
            "relative flex flex-none items-center justify-center rounded rounded-br-none rounded-tr-none bg-cover",
            `genshin-bg-rarity-${item.rarity}`,
          )}
        >
          <Image
            src={`/food/${item.id}_${item.type}.png`}
            height={100}
            width={100}
            alt={item.name}
          />
          <div className="absolute bottom-0 flex w-full items-center justify-center bg-gray-900 bg-opacity-50 px-2 py-0.5">
            <StarRarity
              starClassname="w-4"
              rarity={item.rarity}
              starsSize={42}
            />
          </div>
        </div>
        <div className="ml-1 p-3">
          <div className="flex">
            <h3 className="font-bold text-white">{item.name}</h3>
          </div>
          <p
            className="weapon-bonus"
            dangerouslySetInnerHTML={{
              __html: item.effect,
            }}
          />
          {item.character && (
            <div className="bottom-0 right-0 float-right">
              <Link href={`/${locale}/character/${item.character.id}`}>
                <div className="group overflow-hidden rounded-full border-4 border-transparent transition hover:border-vulcan-500 hover:shadow-xl">
                  <SimpleRarityBox
                    img={getUrl(
                      `/characters/${item.character.id}/image.png`,
                      48,
                      48,
                    )}
                    alt={item.character.name}
                    rarity={0}
                    className="h-12 w-12 rounded-full transition-transform group-hover:scale-125"
                  />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(FoodCard);
