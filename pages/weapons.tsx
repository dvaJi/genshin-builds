import clsx from "clsx";
import GenshinData from "genshin-data";
import { InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
      </div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="flex flex-wrap justify-center">
        {filteredWeapons.map((weapon) => (
          <Link
            key={weapon.id}
            href={`/weapon/${weapon.id}`}
            className="h-26 relative m-2 inline-block w-24 scale-100 rounded-lg bg-vulcan-500 transition-all hover:scale-105 hover:bg-vulcan-400 hover:shadow-lg md:w-32 lg:h-auto lg:w-32 xl:w-32"
          >
            <div
              className="flex flex-row justify-center rounded-t-lg rounded-br-3xl bg-cover"
              style={{
                backgroundImage: `url(${getUrl(
                  `/bg_${weapon.rarity}star.png`
                )})`,
              }}
            >
              <span>
                <img
                  src={getUrl(`/weapons/${weapon.id}.png`, 140, 140)}
                  alt={weapon.name}
                  className="h-24 rounded-t-lg rounded-br-3xl md:h-32 lg:h-32 xl:h-32"
                />
              </span>
              <div className="absolute top-20 md:top-28 lg:top-28 xl:top-28">
                <StarRarity
                  starClassname="w-5"
                  rarity={weapon.rarity}
                  starsSize={46}
                />
              </div>
            </div>
            <h3 className="flex h-9 items-center justify-center overflow-hidden rounded-b-lg text-center text-xs leading-none text-slate-200 lg:text-sm">
              {weapon.name}
            </h3>
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
    select: ["id", "rarity", "name", "type"],
  });

  const common = await getCommon(locale, "genshin");

  return {
    props: {
      weapons: weapons.sort((a, b) => {
        return b.rarity - a.rarity || a.name.localeCompare(b.name);
      }),
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
