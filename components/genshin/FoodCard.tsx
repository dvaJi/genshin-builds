import Link from "next/link";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import SimpleRarityBox from "../SimpleRarityBox";
import StarRarity from "../StarRarity";

import { FoodItem } from "@pages/food";
import { getUrl } from "@lib/imgUrl";

interface FoodCardProps {
  item: FoodItem;
}

const FoodCard = ({ item }: FoodCardProps) => {
  return (
    <div className="mb-2 flex flex-col rounded border border-vulcan-700 bg-vulcan-800">
      <div className="flex h-full flex-row">
        <div
          className="relative flex flex-none items-center justify-center rounded rounded-tr-none rounded-br-none bg-cover"
          style={{
            backgroundImage: `url(${getUrl(`/bg_${item.rarity}star.png`)})`,
          }}
        >
          <LazyLoadImage
            src={getUrl(`/food/${item.id}_${item.type}.png`, 100, 100)}
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
              <Link href={`/character/${item.character.id}`}>
                <div className="group overflow-hidden rounded-full border-4 border-transparent transition hover:border-vulcan-500 hover:shadow-xl">
                  <SimpleRarityBox
                    img={getUrl(
                      `/characters/${item.character.id}/${item.character.id}_portrait.png`,
                      48,
                      48
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
