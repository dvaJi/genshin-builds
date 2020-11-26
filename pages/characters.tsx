import { GetStaticProps } from "next";
import { CgAsterisk } from "react-icons/cg";
import { MdKeyboardArrowDown, MdSearch } from "react-icons/md";

import charactersData from "../utils/characters.json";
import { Character } from "../interfaces/character";
import CharacterCard from "../components/CharacterCard";
import useDropdown from "../hooks/use-dropdown";
import WeaponIcon from "../components/WeaponIcon";
import { memo, useState } from "react";
import ButtonGroup from "../components/ButtonGroup";
import { Button } from "../components/Button";

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
  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Characters
      </h2>
      <div className="w-full flex flex-wrap my-3">
        <div className="flex focus:outline-none focus:ring-0 focus:border-transparent w-48 h-10 border border-gray-700 items-center rounded-lg">
          <MdSearch className="flex" />
          <input
            className="h-full relative bg-transparent text-white"
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
            onSelect={(value) => console.log(value)}
          />
        </div>
        <div className="flex w-36 mx-2">
          <Dropdown
            type="class"
            options={types}
            onSelect={(value) => console.log(value)}
          />
        </div>
        <div className="flex">
          <ButtonGroup>
            <Button>All Tiers</Button>
            <Button>1</Button>
            <Button>2</Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="grid gap-3 grid-cols-5">
        {characters
          .filter((c) =>
            textFilter
              ? c.name.toUpperCase().startsWith(textFilter.toUpperCase())
              : true
          )
          .map((character) => (
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
      <div className="relative" ref={containerRef}>
        <div className="flex overflow-hidden cursor-pointer h-full flex-col relative border border-gray-700 rounded-lg px-2">
          <div
            className="flex justify-between items-center h-9"
            onClick={isOpen ? close : open}
          >
            <div className="flex items-center text-white">
              <CgAsterisk className="fill-current text-white text-2xl" />
              <span className="ml-2 text-purple-500 text-sm">
                {selected ? selected : `Any ${type}`}
              </span>
            </div>
            <MdKeyboardArrowDown className="ml-4" />
          </div>
        </div>
        <div
          className="w-full absolute z-1000 cursor-pointer block bg-gray-900 max-h-80"
          style={{
            display: isOpen ? "initial" : "none",
          }}
        >
          <div className="relative overflow-y-auto max-h-80">
            <div
              onClick={() => {
                onSelect("");
                close();
              }}
            >
              <div className="flex items-center text-white py-3 px-4">
                <CgAsterisk className="w-4 h-4" />
                <span className="ml-4">{`Any ${type}`}</span>
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
                  <WeaponIcon weapon={option} className="w-4 h-4" />
                  <span className="ml-4">{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Dropdown.whyDidYouRender = true;
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
