import clsx from "clsx";
import GenshinData, { Character } from "genshin-data";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Metadata from "@components/Metadata";
import ElementIcon from "@components/genshin/ElementIcon";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getCommon, getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type CharactersProps = {
  characters: Character[];
  elements: string[];
  common: Record<string, string>;
};

const CharactersPage = ({ characters, elements, common }: CharactersProps) => {
  const [elementsFilter, setElementsFilter] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [rarityFilter, setRarityFilter] = useState<number[]>([5, 4]);
  const [charactersFiltered, setCharactersFiltered] = useState<string[]>(
    characters.map((c) => c.id)
  );
  const { t } = useIntl("characters");

  useEffect(() => {
    setCharactersFiltered(
      characters
        .filter(
          (c) =>
            elementsFilter.length === 0 || elementsFilter.includes(c.element)
        )
        .filter((c) => rarityFilter.includes(c.rarity))
        .filter((c) => c.name.toLowerCase().includes(nameFilter.toLowerCase()))
        .map((c) => c.id)
    );
  }, [characters, elementsFilter, nameFilter, rarityFilter]);

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Characters List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
        })}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "characters", defaultMessage: "Characters" })}
      </h2>
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
              <ElementIcon type={common[element]} height={32} width={32} />
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder={t({
              id: "search",
              defaultMessage: "Search",
            })}
            className="my-4 w-full max-w-[400px] rounded-full bg-gray-700 px-4 py-2 text-xl font-semibold text-gray-200 ring-2 ring-gray-500/10 focus:outline-none focus:ring-gray-400"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="card grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
        {characters.map((character) => (
          <Link
            key={character.id}
            href={`/character/${character.id}`}
            className={clsx(
              "flex flex-col items-center justify-center text-center",
              {
                hidden: !charactersFiltered.includes(character.id),
              }
            )}
          >
            <div
              className="group relative overflow-hidden rounded-full border-4 border-vulcan-600/70 bg-cover transition hover:border-vulcan-500"
              style={{
                backgroundImage: `url(${getUrlLQ(
                  `/bg_${character.rarity}star.png`,
                  4,
                  4
                )})`,
              }}
            >
              <LazyLoadImage
                className="z-20 scale-110 rounded-full transition group-hover:scale-125"
                alt={character.id}
                src={getUrl(`/characters/${character.id}/image.png`, 140, 140)}
                width={100}
                height={100}
                placeholder={<div className="h-full w-full" />}
                placeholderSrc={getUrlLQ(
                  `/characters/${character.id}/image.png`,
                  4,
                  4
                )}
              />
              <ElementIcon
                type={common[character.element]}
                height={24}
                width={24}
                className="absolute right-2 top-2 rounded-full bg-vulcan-700 lg:right-2 lg:top-5"
              />
            </div>
            <span className="text-white">{character.name}</span>
          </Link>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "element", "rarity"],
  });
  const elements = characters.reduce((acc, character) => {
    if (!acc.includes(character.element)) {
      acc.push(character.element);
    }
    return acc;
  }, [] as string[]);

  const common = await getCommon(locale, "genshin");

  return {
    props: {
      characters,
      elements,
      lngDict,
      common,
      bgStyle: {
        image: getUrlLQ(`/regions/Inazuma_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default CharactersPage;
