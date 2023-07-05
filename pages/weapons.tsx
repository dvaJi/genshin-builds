import clsx from "clsx";
import GenshinData from "genshin-data";
import { InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Crement from "@components/Crement";
import Metadata from "@components/Metadata";
import SearchInput from "@components/SearchInput";
import StarRarity from "@components/StarRarity";

import useDebounce from "@hooks/use-debounce";
import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { trackClick } from "@lib/gtag";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getCommon, getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const weaponTypes = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

const WeaponsPage = ({
  weapons,
  common,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [filteredWeapons, setWeaponFilter] = useState(weapons);
  const [searchTerm, setSearchTerm] = useState("");
  const [refinement, setRefinement] = useState(1);
  const [weaponStatIndex, setWeaponStatIndex] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy] = useState<"rarity" | "asc">("rarity");

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  useEffect(() => {
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
  }, [debouncedSearchTerm, typeFilter, sortBy, weapons, common]);

  const { t } = useIntl("weapons");
  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Weapons List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "All the best weapons, locations, and stats, including Bows, Catalysts, Claymores, Swords, and Polearms.",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "weapons", defaultMessage: "Weapons" })}
      </h2>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="my-3 md:flex">
        <div className="flex-1">
          <div className="md:flex">
            <SearchInput
              value={searchTerm}
              setValue={(e) => {
                trackClick(`weapon_search`);
                setSearchTerm(e);
              }}
              placeholder={t({ id: "search", defaultMessage: "Search..." })}
            />
            <div className="ml-3 text-center">
              {weaponTypes.map((type) => (
                <button
                  key={type}
                  className={clsx(
                    "mr-1 rounded border hover:border-gray-700 hover:bg-vulcan-800",
                    type === typeFilter
                      ? "border-gray-700 bg-vulcan-800"
                      : "border-gray-800"
                  )}
                  onClick={() => {
                    trackClick(`weapon_${type}`);
                    if (type === typeFilter) {
                      setTypeFilter("");
                    } else {
                      setTypeFilter(type);
                    }
                  }}
                >
                  <LazyLoadImage
                    className="h-10 w-10"
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
          <div className="mr-2 flex flex-col items-center">
            <h3 className="font-semibold">
              {t({ id: "level", defaultMessage: "Level" })}
            </h3>
            <div className="mx-2 text-lg font-bold text-white">
              {weapons[0].stats.levels[weaponStatIndex].level}
            </div>
          </div>
          <div className="mr-2 flex flex-col items-center">
            <h3 className="font-semibold">
              {t({ id: "ascension", defaultMessage: "Ascension" })}
            </h3>
            <div className="mx-2 text-lg font-bold text-white">
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
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="">
        {filteredWeapons.map((weapon) => (
          <Link
            key={weapon.id}
            href={`/weapon/${weapon.id}`}
            className="mb-2 flex flex-col rounded border border-vulcan-700 bg-vulcan-800 hover:border-vulcan-500 hover:bg-vulcan-700"
          >
            <div className="flex h-full flex-row">
              <div
                className="relative flex flex-none items-center justify-center rounded rounded-br-none rounded-tr-none bg-cover"
                style={{
                  backgroundImage: `url(${getUrl(
                    `/bg_${weapon.rarity}star.png`
                  )})`,
                }}
              >
                <LazyLoadImage
                  src={getUrl(`/weapons/${weapon.id}.png`, 140, 140)}
                  height={126}
                  width={126}
                  alt={weapon.name}
                />
                <div className="absolute bottom-0 flex w-full items-center justify-center bg-gray-900 bg-opacity-50 px-2 py-0.5">
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const weapons = await genshinData.weapons({
    select: ["id", "rarity", "name", "stats", "refinements", "type"],
  });

  const common = await getCommon(locale, "genshin");

  return {
    props: {
      weapons,
      lngDict,
      common,
      bgStyle: {
        image: getUrlLQ(`/regions/Sumeru_n.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default WeaponsPage;
