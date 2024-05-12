"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import CharacterPortrait from "@components/tof/CharacterPortrait";
import Image from "@components/tof/Image";
import useDebounce from "@hooks/use-debounce";
import useIntl from "@hooks/use-intl";
import type { Characters } from "@interfaces/tof/characters";
import { getRarityColor } from "@utils/rarity";
import { slugify2 } from "@utils/hash";

const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  characters: Characters[];
};

export default function CharactersList({ characters }: Props) {
  const [filteredCharacters, setFilteredCharacters] = useState(characters);
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState<number | null>(null);
  const [elementFilter, setElementFilter] = useState("");
  const [resonanceFilter, setResonanceFilter] = useState("");
  const { t, locale } = useIntl("characters");

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const filterCharacters = () => {
    setFilteredCharacters(
      characters
        .filter((c) => {
          let nameFilter = true;
          let rarityFil = true;
          let typeFil = true;
          let roleFil = true;
          if (debouncedSearchTerm) {
            nameFilter =
              c.name.toUpperCase().indexOf(debouncedSearchTerm.toUpperCase()) >
              -1;
          }

          if (rarityFilter) {
            rarityFil = c.rarity === rarityFilter;
          }

          if (elementFilter) {
            typeFil = c.weapon.element === elementFilter;
          }

          if (resonanceFilter) {
            roleFil = c.weapon.category === resonanceFilter;
          }

          return nameFilter && rarityFil && typeFil && roleFil;
        })
        .sort((a, b) => {
          return b.rarity - a.rarity || a.name.localeCompare(b.name);
        })
    );
  };

  // Call useEffect to filter characters when search term changes
  useEffect(filterCharacters, [
    characters,
    debouncedSearchTerm,
    rarityFilter,
    resonanceFilter,
    elementFilter,
  ]);

  const rarityOptions = [
    // { value: "R", label: "R" },
    { value: 4, label: "SR" },
    { value: 5, label: "SSR" },
  ];

  const elementOptions = [
    { value: "Flame", label: "fire" },
    { value: "Ice", label: "ice" },
    { value: "Physics", label: "physical" },
    { value: "Thunder", label: "volt" },
  ];

  const resonanceOptions = [
    { value: "DPS", label: "dps" },
    { value: "Tank", label: "defense" },
    { value: "SUP", label: "support" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-2">
        <div className="">
          {rarityOptions.map((rarity) => (
            <button
              className={clsx(
                "hover:bg-tof-700 mr-2 px-2 py-1 text-xl",
                rarity.value === rarityFilter && "bg-tof-700",
                getRarityColor(rarity.label)
              )}
              key={rarity.value}
              onClick={() => {
                if (rarityFilter === rarity.value) {
                  setRarityFilter(null);
                } else {
                  setRarityFilter(rarity.value);
                }
              }}
            >
              {rarity.label}
            </button>
          ))}
        </div>
        <div>
          {elementOptions.map((element) => (
            <button
              className={clsx(
                "hover:bg-tof-700 mr-2 px-2 py-1 text-xl",
                element.value === elementFilter && "bg-tof-700"
              )}
              key={element.value}
              onClick={() => {
                if (elementFilter === element.value) {
                  setElementFilter("");
                } else {
                  setElementFilter(element.value);
                }
              }}
            >
              <Image
                src={`/icons/${element.label}.png`}
                className="h-7 w-7"
                alt={element.value}
                width={28}
                height={28}
              />
            </button>
          ))}
        </div>
        <div>
          {resonanceOptions.map((resonance) => (
            <button
              className={clsx(
                "hover:bg-tof-700 mr-2 px-2 py-1 text-xl",
                resonance.value === resonanceFilter && "bg-tof-700"
              )}
              key={resonance.value}
              onClick={() => {
                if (resonanceFilter === resonance.value) {
                  setResonanceFilter("");
                } else {
                  setResonanceFilter(resonance.value);
                }
              }}
            >
              <Image
                src={`/icons/${resonance.label}.png`}
                className="h-7 w-7"
                alt={resonance.value}
                width={28}
                height={28}
              />
            </button>
          ))}
        </div>
        <input
          type="text"
          className="rounded border-opacity-50 bg-vulcan-700 px-2 py-1 text-white"
          placeholder={t({ id: "search", defaultMessage: "Search..." })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <div className="flex flex-wrap items-center justify-center gap-1 rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg md:grid-cols-3 lg:grid-cols-4">
        {filteredCharacters.map((character) => (
          <Link
            key={character.id}
            href={`/${locale}/tof/character/${slugify2(character.name)}`}
          >
            <CharacterPortrait character={character} key={character.id} />
          </Link>
        ))}
      </div>
    </div>
  );
}
