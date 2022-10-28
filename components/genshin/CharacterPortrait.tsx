import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import ElementIcon from "./ElementIcon";

import { getUrl } from "@lib/imgUrl";

interface CharacterPortraitProps {
  character: {
    id: string;
    name: string;
    element?: string;
    constellationNum?: number;
  };
  weapon?: {
    id: string;
    name: string;
    rarity: number;
  };
  showElement?: boolean;
}

const CharacterPortrait = ({
  character,
  weapon,
  showElement = true,
}: CharacterPortraitProps) => {
  return (
    <div className="group w-32 transform cursor-pointer text-gray-400 transition-all duration-200 ease-linear hover:text-white">
      <div>
        <div className="group relative text-center">
          <LazyLoadImage
            className="inline-block rounded-full border-4 border-transparent shadow-lg transition group-hover:scale-110 group-hover:border-vulcan-500 group-hover:shadow-xl"
            src={getUrl(
              `/characters/${character.id}/${character.id}_portrait.png`,
              80,
              80
            )}
            alt={character.name}
            width={80}
            height={80}
          />
          {showElement && character.element && (
            <div className="absolute top-0 right-5 rounded-full bg-vulcan-900 px-1 pt-1">
              <ElementIcon width={20} height={20} type={character.element} />
            </div>
          )}
          {character.constellationNum !== undefined && (
            <div className="absolute bottom-0 right-2/3 rounded-full bg-vulcan-700 p-1 text-xs font-bold text-gray-300">
              {`C${character.constellationNum}`}
            </div>
          )}
          {weapon && (
            <div
              className="absolute bottom-0 left-2/3 rounded bg-cover opacity-0 transition-opacity delay-100 group-hover:opacity-100"
              style={{
                backgroundImage: `url(${getUrl(
                  `/bg_${weapon.rarity}star.png`
                )})`,
                height: 32,
              }}
            >
              <LazyLoadImage
                src={getUrl(`/weapons/${weapon.id}.png`, 32, 32)}
                height={32}
                width={32}
                alt={weapon.name}
              />
            </div>
          )}
        </div>
      </div>
      <p className="text-center text-base">{character.name}</p>
    </div>
  );
};

export default memo(CharacterPortrait);