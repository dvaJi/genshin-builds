import { GetStaticProps } from "next";

import charactersData from "../utils/characters.json";
import { Character } from "../interfaces/character";
import CharacterCard from "../components/CharacterCard";
import useDropdown from "../hooks/use-dropdown";

type Props = {
  characters: Character[];
};

const CharactersPage = ({ characters }: Props) => (
  <div>
    <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      Characters
    </h2>
    <div className="w-full flex flex-wrap my-3">
      <div className="flex w-48 h-10 border border-gray-700 items-center rounded-lg">
        <svg width="16px" height="16px" viewBox="0 0 16 16" className="flex">
          <path
            d="M29 25.844l-4.999-4.996a6.128 6.128 0 10-10.966-4.37 6.129 6.129 0 009.81 5.522L27.846 27 29 25.844zm-10.348-4.243a4.497 4.497 0 11.954-8.943 4.497 4.497 0 01-.954 8.943z"
            transform="translate(-143 -324) translate(70 60) translate(60 211) translate(0 42)"
            fill="currentColor"
            stroke="none"
            stroke-width="1"
            fill-rule="evenodd"
          ></path>
        </svg>
        <input
          className="h-full relative bg-transparent text-white"
          placeholder="Search by champion"
          type="text"
          value=""
        />
      </div>
      <div className="flex w-36 mx-2 my-1">
        <div className="flex overflow-hidden cursor-pointer h-full flex-col relative border border-gray-700 rounded-lg">
          <div class="filterstyles__ClassOriringOptionsStyled-sc-9kvn46-8 iLImON">
            <div
              data-sel-id="tftoriginTypeSelector"
              class="filterstyles__ChampionTypeOptionWrapper-sc-9kvn46-9 indWAY"
            >
              <svg
                width="16px"
                height="14px"
                viewBox="0 0 16 14"
                class="filterstyles__IconAllStyled-sc-9kvn46-2 kMPgNt"
              >
                <polygon
                  fill-rule="nonzero"
                  points="5.54087789 8.42024936 1.39130435 8.42024936 0 7.00000001 1.39130435 5.57975065 5.54087789 5.57975065 3.40368953 1.9488738 3.8796954 0 5.78885071 0.485908812 8 4.24243814 10.2111493 0.485908812 12.1203046 0 12.5963105 1.9488738 10.4591221 5.57975065 14.6086957 5.57975065 16 7.00000001 14.6086957 8.42024936 10.4591221 8.42024936 12.5963105 12.0511262 12.1203046 14 10.2111493 13.5140912 8 9.75756187 5.78885071 13.5140912 3.8796954 14 3.40368953 12.0511262"
                ></polygon>
              </svg>
              <span data-sel-id="name">Any Origin</span>
            </div>
            <svg
              width="9px"
              height="5px"
              viewBox="0 0 9 5"
              class="filterstyles__ArrowStyled-sc-9kvn46-12 dcMFBr"
            >
              <path
                d="M110.577 9.5h-.454l3.377 3.753 3.377-3.753h-.454l-2.923 3.247-2.923-3.247z"
                transform="translate(-239 -189) translate(70 60) translate(60 120)"
                stroke="#F5F0D9"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
          <div class="s1bxr5fa-2 ejiMbo">
            <div class="filterstyles__ClassOriringOptionsStyled-sc-9kvn46-8 iLImON">
              <div
                data-sel-id="tftoriginTypeSelector"
                class="filterstyles__ChampionTypeOptionWrapper-sc-9kvn46-9 indWAY"
              >
                <img
                  src="https://cdn.mobalytics.gg/assets/tft/images/synergies/set4/enlightened-gold.svg"
                  alt="Enlightened"
                  class="filterstyles__SynergyIcon-sc-9kvn46-10 bONkaZ"
                />
                <span data-sel-id="name">Enlightened</span>
              </div>
              <svg
                width="9px"
                height="5px"
                viewBox="0 0 9 5"
                class="filterstyles__ArrowStyled-sc-9kvn46-12 dcMFBr"
              >
                <path
                  d="M110.577 9.5h-.454l3.377 3.753 3.377-3.753h-.454l-2.923 3.247-2.923-3.247z"
                  transform="translate(-239 -189) translate(70 60) translate(60 120)"
                  stroke="#F5F0D9"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-36 mx-2 my-1">
        <WeaponDropdown />
      </div>
      <div className="flex">rarity</div>
      <div className="flex">tier</div>
    </div>
    <div className="grid gap-3 grid-cols-5">
      {characters.map((character) => (
        <CharacterCard character={character} />
      ))}
    </div>
  </div>
);

const WeaponDropdown = () => {
  const [containerRef, isOpen, open, close] = useDropdown();
  return (
    <div className="select-container" ref={containerRef}>
      <input onFocus={open} />

      {isOpen && (
        <select>
          <option>First option</option>
          <option>Second option</option>
          <option>Third option</option>
        </select>
      )}

      <button onClick={close}>Close select</button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const characters = (charactersData as Character[]).filter((c) => !c.soon);
  const weapons = [...new Set(characters.map((c) => c.weapon))];
  const types = [...new Set(characters.map((c) => c.type))];
  const rarityList = [...new Set(characters.map((c) => c.rarity))];
  const tierList = [...new Set(characters.map((c) => c.tier))];

  return {
    props: { characters },
    revalidate: 1,
  };
};

export default CharactersPage;
