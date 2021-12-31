/* eslint-disable react-hooks/exhaustive-deps */
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import GenshinData, { Weapon } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import StarRarity from "@components/StarRarity";
import Crement from "@components/Crement";
import SearchInput from "@components/SearchInput";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import useDebounce from "@hooks/use-debounce";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";

interface WeaponsPageProps {
  weapons: Weapon[];
  common: Record<string, string>;
}

const weaponTypes = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

const WeaponsPage = ({ weapons, common }: WeaponsPageProps) => {
  const [filteredWeapons, setWeaponFilter] = useState(weapons);
  const [searchTerm, setSearchTerm] = useState("");
  const [refinement, setRefinement] = useState(1);
  const [weaponStatIndex, setWeaponStatIndex] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy] = useState<"rarity" | "asc">("rarity");

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const filterWeapons = () => {
    setWeaponFilter(
      weapons
        .filter((w) => {
          let nameFilter = true;
          let typeFil = true;
          if (debouncedSearchTerm) {
            nameFilter =
              w.name.toUpperCase().indexOf(debouncedSearchTerm.toUpperCase()) >
              -1;
          }

          if (typeFilter) {
            typeFil = common[w.type] === typeFilter;
          }

          return nameFilter && typeFil;
        })
        .sort((a, b) => {
          if (sortBy === "asc") return a.name.localeCompare(b.name);
          return b.rarity - a.rarity || a.name.localeCompare(b.name);
        })
    );
  };

  useEffect(() => {
    filterWeapons();
  }, [debouncedSearchTerm, typeFilter, sortBy]);

  const { t } = useIntl();
  return (
    <div>
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.weapons",
          defaultMessage: "Genshin Impact Weapons List",
        })}
        pageDescription={t({
          id: "title.weapons.description",
          defaultMessage:
            "All the best weapons, locations, and stats, including Bows, Catalysts, Claymores, Swords, and Polearms.",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "weapons", defaultMessage: "Weapons" })}
      </h2>
      <div className="md:flex my-3">
        <div className="flex-1">
          <div className="md:flex">
            <SearchInput
              value={searchTerm}
              setValue={setSearchTerm}
              placeholder={t({ id: "search", defaultMessage: "Search..." })}
            />
            <div className="ml-3 text-center">
              {weaponTypes.map((type) => (
                <button
                  key={type}
                  className={clsx(
                    "border rounded hover:border-gray-700 hover:bg-vulcan-800 mr-1",
                    type === typeFilter
                      ? "border-gray-700 bg-vulcan-800"
                      : "border-gray-800"
                  )}
                  onClick={() => {
                    if (type === typeFilter) {
                      setTypeFilter("");
                    } else {
                      setTypeFilter(type);
                    }
                  }}
                >
                  <LazyLoadImage
                    className="w-10 h-10"
                    alt={type}
                    src={getUrl(`/weapons_type/${type}.png`, 40, 40)}
                    width={40}
                    height={40}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* <div>
            <button onClick={() => setSortBy("rarity")}>
              <FcAlphabeticalSortingAz />
            </button>
            <button onClick={() => setSortBy("asc")}>
              <FcNumericalSorting21 />
            </button>
          </div> */}
        </div>
        <div className="flex justify-center">
          <div>
            <Crement
              title={t({ id: "stats", defaultMessage: "Stats" })}
              currentValue={weaponStatIndex}
              setValue={setWeaponStatIndex}
              values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
            />
          </div>
          <div className="flex flex-col items-center mr-2">
            <h3 className="font-semibold">
              {t({ id: "level", defaultMessage: "Level" })}
            </h3>
            <div className="text-lg font-bold text-white mx-2">
              {weapons[0].stats.levels[weaponStatIndex].level}
            </div>
          </div>
          <div className="flex flex-col items-center mr-2">
            <h3 className="font-semibold">
              {t({ id: "ascension", defaultMessage: "Ascension" })}
            </h3>
            <div className="text-lg font-bold text-white mx-2">
              {weapons[0].stats.levels[weaponStatIndex].ascension}
            </div>
          </div>

          <div>
            <Crement
              title={t({ id: "refinement", defaultMessage: "Refinement" })}
              currentValue={refinement}
              values={[1, 2, 3, 4, 5]}
              setValue={setRefinement}
            />
          </div>
        </div>
      </div>
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <div className="">
        {filteredWeapons.map((weapon) => (
          <Link key={weapon.id} href={`/weapon/${weapon.id}`}>
            <a className="bg-vulcan-800 border border-vulcan-700 mb-2 rounded flex flex-col hover:bg-vulcan-700 hover:border-vulcan-500">
              <div className="flex flex-row h-full">
                <div
                  className="flex flex-none relative bg-cover rounded rounded-tr-none rounded-br-none items-center justify-center"
                  style={{
                    backgroundImage: `url(${getUrl(
                      `/bg_${weapon.rarity}star.png`
                    )})`,
                  }}
                >
                  <LazyLoadImage
                    src={getUrl(`/weapons/${weapon.id}.png`, 126, 126)}
                    height={126}
                    width={126}
                    alt={weapon.name}
                  />
                  <div className="absolute bottom-0 bg-gray-900 bg-opacity-50 w-full px-2 py-0.5 items-center justify-center flex">
                    <StarRarity
                      starClassname="w-4"
                      rarity={weapon.rarity}
                      starsSize={42}
                    />
                  </div>
                </div>
                <div className="ml-1 p-3">
                  <div className="flex">
                    <h3 className="font-bold text-white">{weapon.name}</h3>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-300">
                      <span className="font-semibold">
                        {t({ id: "type", defaultMessage: "Type" })}:
                      </span>{" "}
                      {weapon.type} |{" "}
                      {weapon.stats.secondary && (
                        <>
                          <span className="font-semibold">
                            {t({
                              id: "secondary",
                              defaultMessage: "Secondary",
                            })}
                            :
                          </span>{" "}
                          {weapon.stats.secondary}{" "}
                          {weapon.stats.levels[weaponStatIndex]?.secondary} |{" "}
                        </>
                      )}
                      <span className="font-semibold">
                        {weapon.stats.primary}:
                      </span>{" "}
                      {weapon.stats.levels[weaponStatIndex]?.primary}
                    </h3>
                  </div>
                  <p
                    className="weapon-bonus"
                    dangerouslySetInnerHTML={{
                      __html: weapon.refinements[refinement - 1]?.desc,
                    }}
                  />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const weapons = await genshinData.weapons({
    select: [
      "id",
      "rarity",
      "name",
      "stats",
      "refinements",
      "type",
    ],
  });

  const common = require(`../_content/data/common.json`)[locale];

  return {
    props: {
      weapons,
      lngDict,
      common,
    },
  };
};

export default WeaponsPage;
