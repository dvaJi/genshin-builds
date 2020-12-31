import { GetStaticProps } from "next";
import { CgAsterisk } from "react-icons/cg";
import { MdKeyboardArrowDown, MdSearch } from "react-icons/md";

import charactersData from "../_content/data/characters.json";
import { Character } from "../interfaces/character";
import CharacterCard from "../components/CharacterCard";
import useDropdown from "../hooks/use-dropdown";
import WeaponIcon from "../components/WeaponIcon";
import { memo, useMemo, useState } from "react";
import ButtonGroup from "../components/ButtonGroup";
import Button from "../components/Button";
import ElementIcon from "../components/ElementIcon";

type CharactersProps = {
  characters: Character[];
  weapons: string[];
  types: string[];
  tierList: number[];
};

const CharactersPage = ({
  characters,
  weapons,
  types,
  tierList,
}: CharactersProps) => {
  const [textFilter, setTextFilter] = useState("");
  const [weaponFilter, setWeaponFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [tierFilter, setTierFilter] = useState(0);
  const charactersFiltered = useMemo(
    () =>
      characters.filter((c) => {
        if (textFilter) {
          return c.name.toUpperCase().startsWith(textFilter.toUpperCase());
        }

        if (weaponFilter) {
          return c.weapon === weaponFilter;
        }

        if (typeFilter) {
          return c.type === typeFilter;
        }

        if (tierFilter) {
          return c.tier === tierFilter;
        }

        return true;
      }),
    [textFilter, weaponFilter, typeFilter, tierFilter]
  );
  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Characters
      </h2>
      <div className="w-full flex flex-wrap my-3">
        <div className="flex w-52 h-10 border border-gray-700 items-center rounded-lg">
          <MdSearch className="flex mx-2" />
          <input
            className="h-full relative bg-transparent text-white focus:outline-none focus:ring-0 focus:border-transparent"
            placeholder="Search by champion"
            type="text"
            onChange={(e) => setTextFilter(e.target.value)}
            value={textFilter}
          />
        </div>
        <div className="flex w-40 mx-2">
          <Dropdown
            type="weapon"
            options={weapons}
            selected={weaponFilter}
            onSelect={(value) => setWeaponFilter(value)}
          />
        </div>
        <div className="flex w-36 mx-2">
          <Dropdown
            type="class"
            options={types}
            selected={typeFilter}
            onSelect={(value) => setTypeFilter(value)}
          />
        </div>
        <div className="flex">
          <ButtonGroup>
            <Button onClick={() => setTierFilter(0)}>All Tiers</Button>
            {tierList.map((tier) => (
              <Button
                onClick={() => setTierFilter(tier)}
                isActive={tier === tierFilter}
              >
                {tier}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <div className="grid gap-3 grid-cols-5">
        {charactersFiltered.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};

interface DropdownProps {
  type: string;
  options: string[];
  onSelect: (value: string) => void;
  selected?: string;
}

const Dropdown = memo(
  ({ type, options, selected, onSelect }: DropdownProps) => {
    const [containerRef, isOpen, open, close] = useDropdown();
    return (
      <div className="relative w-full" ref={containerRef}>
        <div className="flex overflow-hidden cursor-pointer h-full flex-col relative border border-gray-700 rounded-lg px-2">
          <div
            className="flex justify-between items-center h-9"
            onClick={isOpen ? close : open}
          >
            <div className="flex items-center text-white">
              {selected ? (
                type === "weapon" ? (
                  <WeaponIcon weapon={selected} className="w-4 h-4" />
                ) : (
                  <ElementIcon type={selected} className="w-4 h-4" />
                )
              ) : (
                <CgAsterisk className="w-5 h-5" />
              )}
              <span className="ml-2 text-purple-500 text-sm">
                {selected ? selected : `Any ${type}`}
              </span>
            </div>
            <MdKeyboardArrowDown className="ml-4" />
          </div>
        </div>
        <div
          className="w-full absolute z-1000 cursor-pointer block bg-gray-900 max-h-80 min-w-min"
          style={{
            display: isOpen ? "initial" : "none",
          }}
        >
          <div className="relative overflow-y-auto max-h-80 text-sm">
            <div
              onClick={() => {
                onSelect("");
                close();
              }}
            >
              <div className="flex items-center text-white py-3 px-4">
                <CgAsterisk className="w-5 h-5" />
                <span className="ml-3">{`Any ${type}`}</span>
              </div>
            </div>
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onSelect(option);
                  close();
                }}
              >
                <div className="flex items-center text-white py-4 px-4">
                  {type === "weapon" ? (
                    <WeaponIcon weapon={option} className="w-4 h-4" />
                  ) : (
                    <ElementIcon type={option} className="w-4 h-4" />
                  )}
                  <span className="ml-3">{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

CharactersPage.whyDidYouRender = true;

export const getStaticProps: GetStaticProps = async () => {
  const characters = (charactersData as Character[]).filter(
    (c) => !c.soon && c.name !== "Xiao"
  );
  const weapons = ["Bow", "Catalyst", "Claymore", "Polearm", "Sword"];
  const types = ["Anemo", "Cryo", "Electro", "Dendro", "Geo", "Hydro", "Pyro"];
  const tierList = [1, 2, 3, 4, 5];

  return {
    props: { characters, weapons, types, tierList },
    revalidate: 1,
  };
};

export default CharactersPage;
