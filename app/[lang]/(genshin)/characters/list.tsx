"use client";

import clsx from "clsx";
import type { Character } from "@interfaces/genshin";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import ElementIcon from "@components/genshin/ElementIcon";
import useIntl from "@hooks/use-intl";
import { getUrl, getUrlLQ } from "@lib/imgUrl";

type Props = {
  characters: (Character & { beta?: boolean })[];
  elements: string[];
};

export default function GenshinCharactersList({ characters, elements }: Props) {
  const { t, locale } = useIntl("characters");
  const [elementsFilter, setElementsFilter] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [rarityFilter, setRarityFilter] = useState<number[]>([5, 4]);
  const [charactersFiltered, setCharactersFiltered] = useState<string[]>(
    characters.map((c) => c.id)
  );

  useEffect(() => {
    setCharactersFiltered(
      characters
        .filter((c) => {
          if (
            elementsFilter.length > 0 &&
            !elementsFilter.includes(c.element)
          ) {
            return false;
          }
          if (!rarityFilter.includes(c.rarity)) {
            return false;
          }
          if (!c.name.toLowerCase().includes(nameFilter.toLowerCase())) {
            return false;
          }
          return true;
        })
        .map((c) => c.id)
    );
  }, [characters, elementsFilter, nameFilter, rarityFilter]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center">
        <div className="flex flex-wrap justify-center">
          {[5, 4].map((rarity) => (
            <button
              key={rarity}
              onClick={() => {
                if (rarityFilter.includes(rarity)) {
                  setRarityFilter(rarityFilter.filter((r) => r !== rarity));
                } else {
                  setRarityFilter([...rarityFilter, rarity]);
                }
              }}
              className={`mx-1 rounded-full px-2 py-1 text-lg ${
                rarityFilter.includes(rarity)
                  ? "bg-gray-500 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
              title={`${rarity} stars`}
            >
              {rarity}⭐
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center">
          {elements.map((element) => (
            <button
              key={element}
              onClick={() => {
                if (elementsFilter.includes(element)) {
                  setElementsFilter(
                    elementsFilter.filter((e) => e !== element)
                  );
                } else {
                  setElementsFilter([...elementsFilter, element]);
                }
              }}
              className={`mx-1 rounded-full px-2 py-1 text-xl font-semibold ${
                elementsFilter.includes(element)
                  ? "bg-gray-500 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
              title={t({ id: element.toLowerCase(), defaultMessage: element })}
            >
              <ElementIcon
                type={t({ id: element, defaultMessage: element })}
                height={32}
                width={32}
              />
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder={t({
              id: "search",
              defaultMessage: "Search for a character...",
            })}
            className="my-4 w-full max-w-[400px] rounded-full bg-gray-700 px-4 py-2 text-xl font-semibold text-gray-200 ring-2 ring-gray-500/10 focus:outline-none focus:ring-gray-400"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="card grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
        {characters
          .sort((a, b) => {
            // Beta characters first
            if (a.beta && !b.beta) return -1;
            if (!a.beta && b.beta) return 1;

            // Name Asc
            return a.name.localeCompare(b.name);
          })
          .map((character) => (
            <Link
              key={character.id}
              href={`/${locale}/character/${character.id}`}
              className={clsx(
                "flex flex-col items-center justify-center text-center",
                {
                  hidden: !charactersFiltered.includes(character.id),
                }
              )}
            >
              <div
                className={clsx(
                  "group relative overflow-hidden rounded-full border-4 border-vulcan-600/70 transition hover:border-vulcan-500",
                  `genshin-bg-rarity-${character.rarity}`
                )}
              >
                <LazyLoadImage
                  className="z-20 scale-110 rounded-full transition group-hover:scale-125"
                  alt={character.id}
                  src={getUrl(
                    `/characters/${character.id}/image.png`,
                    140,
                    140
                  )}
                  width={100}
                  height={100}
                  placeholder={<div className="h-full w-full" />}
                  placeholderSrc={getUrlLQ(
                    `/characters/${character.id}/image.png`,
                    6,
                    6
                  )}
                />
                <ElementIcon
                  type={t({
                    id: character.element,
                    defaultMessage: character.element,
                  })}
                  height={24}
                  width={24}
                  className="absolute right-2 top-2 rounded-full bg-vulcan-700 lg:right-2 lg:top-5"
                />
                {/* Badge */}
                {character.beta && (
                  <div className="absolute bottom-2 left-8 z-50 flex items-center justify-center rounded bg-vulcan-700/80 p-1 shadow">
                    <span className="text-xxs text-white">Beta</span>
                  </div>
                )}
              </div>
              <span className="text-white">{character.name}</span>
            </Link>
          ))}
      </div>
    </>
  );
}
