"use client";

import clsx from "clsx";
import { memo } from "react";

import ElementIcon from "./ElementIcon";
import Image from "./Image";

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
  artifacts?: {
    id: string;
    name: string;
  }[];
  showElement?: boolean;
}

const CharacterPortrait = ({
  character,
  weapon,
  artifacts,
  showElement = true,
}: CharacterPortraitProps) => {
  return (
    <div className="group w-32 transform cursor-pointer text-gray-400 transition-all duration-200 ease-linear hover:text-white">
      <div>
        <div className="group relative text-center">
          <Image
            className="inline-block rounded-full border-4 border-transparent shadow-lg transition group-hover:scale-110 group-hover:border-vulcan-500 group-hover:shadow-xl"
            src={`/characters/${character.id}/image.png`}
            alt={character.name}
            width={80}
            height={80}
          />
          {showElement && character.element && (
            <div className="absolute right-5 top-0 rounded-full bg-vulcan-900 px-1 pt-1">
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
              className={clsx(
                "absolute bottom-0 left-2/3 translate-x-0 rounded bg-cover opacity-0 transition-all delay-100 group-hover:translate-x-2 group-hover:opacity-100",
                `genshin-bg-rarity-${weapon.rarity}`,
              )}
            >
              <Image
                src={`/weapons/${weapon.id}.png`}
                height={32}
                width={32}
                alt={weapon.name}
              />
            </div>
          )}
          {artifacts && (
            <>
              {artifacts.map((artifact, i) => (
                <div
                  key={artifact.id}
                  className="absolute right-2/3 translate-x-0 scale-0 rounded bg-cover transition-all delay-100 group-hover:-translate-x-2 group-hover:scale-105"
                  style={{
                    bottom: i * 32,
                  }}
                >
                  <Image
                    src={`/artifacts/${artifact.id}.png`}
                    height={32}
                    width={32}
                    alt={artifact.name}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <p className="text-center text-base">{character.name}</p>
    </div>
  );
};

export default memo(CharacterPortrait);
