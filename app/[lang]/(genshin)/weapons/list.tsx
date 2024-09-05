"use client";

import clsx from "clsx";
import type { Weapon } from "@interfaces/genshin";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import SearchInput from "@components/SearchInput";
import StarRarity from "@components/StarRarity";
import useDebounce from "@hooks/use-debounce";
import useIntl from "@hooks/use-intl";
import { trackClick } from "@lib/gtag";
import { getUrl } from "@lib/imgUrl";

type Props = {
  weapons: (Weapon & { beta?: boolean })[];
};

const weaponTypes = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

export default function WeaponsList({ weapons }: Props) {
  const [filteredWeapons, setWeaponFilter] = useState(weapons);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { t, locale } = useIntl("weapons");

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  useEffect(() => {
    setWeaponFilter(
      weapons.filter((w) => {
        let nameFilter = true;
        let typeFil = true;
        if (debouncedSearchTerm) {
          nameFilter =
            w.name.toUpperCase().indexOf(debouncedSearchTerm.toUpperCase()) >
            -1;
        }

        if (typeFilter) {
          typeFil = t({ id: w.type, defaultMessage: w.type }) === typeFilter;
        }

        return nameFilter && typeFil;
      })
    );
    trackClick(`weapon_search`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, typeFilter, weapons]);

  return (
    <>
      <div className="my-3 md:flex">
        <div className="flex-1">
          <div className="md:flex">
            <SearchInput
              value={searchTerm}
              setValue={(e) => {
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
      <div className="flex flex-wrap justify-center">
        {filteredWeapons.map((weapon) => (
          <Link
            key={weapon.id}
            href={`/${locale}/weapon/${weapon.id}`}
            prefetch={false}
            className="h-26 relative m-2 inline-block w-24 scale-100 rounded-lg bg-vulcan-500 transition-all hover:scale-105 hover:bg-vulcan-400 hover:shadow-lg md:w-32 lg:h-auto lg:w-32 xl:w-32"
          >
            {/* Badge */}
            {(weapon as any).beta && (
              <div className="absolute left-1 top-1 z-50 flex items-center justify-center rounded bg-vulcan-700/80 p-1 shadow">
                <span className="text-xxs text-white">Beta</span>
              </div>
            )}
            <div
              className={clsx(
                "flex flex-row justify-center rounded-t-lg rounded-br-3xl bg-cover",
                `genshin-bg-rarity-${weapon.rarity}`
              )}
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
            <h3 className="flex h-9 items-center justify-center overflow-hidden rounded-b-lg text-center text-xs leading-none text-slate-200 lg:text-sm lg:leading-none">
              {weapon.name}
            </h3>
          </Link>
        ))}
      </div>
    </>
  );
}
