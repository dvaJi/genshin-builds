import clsx from "clsx";
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import GenshinData, { Weapon } from "genshin-data";
import Metadata from "@components/Metadata";
import StarRarity from "@components/StarRarity";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import useDebounce from "@hooks/use-debounce";
import Crement from "@components/Crement";
import SearchInput from "@components/SearchInput";
import { IMGS_CDN } from "@lib/constants";

interface WeaponsPageProps {
  weapons: Weapon[];
  lngDict: Record<string, string>;
  common: Record<string, string>;
}

const weaponTypes = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

const WeaponsPage = ({ weapons, lngDict, common }: WeaponsPageProps) => {
  const [filteredWeapons, setWeaponFilter] = useState(weapons);
  const [searchTerm, setSearchTerm] = useState("");
  const [refinement, setRefinement] = useState(1);
  const [ascension, setAscension] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy] = useState<"rarity" | "asc">("rarity");

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const showPrimary = (
    base: number,
    values: any[],
    type: "primary" | "secondary"
  ) => {
    if (values[ascension]) {
      return values[ascension][type];
    }

    if (values.length > 0) {
      return values[values.length - 1][type];
    }

    return base;
  };

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
  }, [debouncedSearchTerm, typeFilter, sortBy, lngDict]);

  const [f, fStr] = useIntl(lngDict);
  return (
    <div>
      <Metadata
        fn={fStr}
        pageTitle={fStr({
          id: "title.weapons",
          defaultMessage: "Genshin Impact Weapons List",
        })}
        pageDescription={fStr({
          id: "title.weapons.description",
          defaultMessage:
            "All the best weapons, locations, and stats, including Bows, Catalysts, Claymores, Swords, and Polearms.",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({ id: "weapons", defaultMessage: "Weapons" })}
      </h2>
      <div className="md:flex my-3">
        <div className="flex-1">
          <div className="md:flex">
            <SearchInput
              value={searchTerm}
              setValue={setSearchTerm}
              placeholder={fStr({ id: "search", defaultMessage: "Search..." })}
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
                  <img
                    className="w-10 h-10"
                    src={`${IMGS_CDN}/weapons_type/${type}.png`}
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
              title={fStr({ id: "ascension", defaultMessage: "Ascension" })}
              currentValue={ascension}
              setValue={setAscension}
              values={[0, 1, 2, 3, 4, 5, 6]}
            />
          </div>
          <div>
            <Crement
              title={fStr({ id: "refinement", defaultMessage: "Refinement" })}
              currentValue={refinement}
              values={[1, 2, 3, 4, 5]}
              setValue={setRefinement}
            />
          </div>
        </div>
      </div>
      <div className="">
        {filteredWeapons.map((weapon) => (
          <div
            key={weapon.id}
            className="bg-vulcan-800 border border-vulcan-700 mb-2 rounded flex flex-col"
          >
            <div className="flex flex-row h-full">
              <div
                className="flex flex-none relative bg-cover rounded rounded-tr-none rounded-br-none items-center justify-center"
                style={{
                  backgroundImage: `url(${IMGS_CDN}/bg_${weapon.rarity}star.png)`,
                }}
              >
                <img
                  src={`${IMGS_CDN}/weapons/${weapon.id}.png`}
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
                      {f({ id: "type", defaultMessage: "Type" })}:
                    </span>{" "}
                    {weapon.type} |{" "}
                    <span className="font-semibold">
                      {f({ id: "secondary", defaultMessage: "Secondary" })}:
                    </span>{" "}
                    {weapon.secondary?.name}{" "}
                    {showPrimary(
                      weapon.primary.value,
                      weapon.ascensions,
                      "secondary"
                    )}{" "}
                    |{" "}
                    <span className="font-semibold">
                      {weapon.primary.name}:
                    </span>{" "}
                    {showPrimary(
                      weapon.primary.value,
                      weapon.ascensions,
                      "primary"
                    )}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const weapons = await genshinData.weapons();

  const common = require(`../_content/data/common.json`)[locale];

  return { props: { weapons, lngDict, common }, revalidate: 1 };
};

export default WeaponsPage;
