import { GetStaticProps } from "next";
import { useRecoilState } from "recoil";
import GenshinData, { Character, Weapon } from "genshin-data";

import { planner } from "@state/planner";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

type Props = {
  characters: Record<string, Character>;
  weapons: Record<string, Weapon>;
  lngDict: Record<string, string>;
};

const AscensionPlanner = ({ characters, weapons, lngDict }: Props) => {
  const [myplanner, setPlanner] = useRecoilState(planner);
  return (
    <div>
      <div>
        <button
          onClick={() =>
            setPlanner((state) => ({
              ...state,
              characters: [...state.characters, "amber"],
            }))
          }
        >
          Add Character
        </button>
        <button>Add Weapon</button>
      </div>
      <div>
        <div>
          {myplanner.characters.map((character) => (
            <div>{characters[character].name}</div>
          ))}
        </div>
        <div>
          {myplanner.weapons.map((weapon) => (
            <div>{weapons[weapon].name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "element"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name"],
  });
  const charactersMap = characters.reduce<Record<string, Character>>(
    (map, value) => {
      map[value.id] = value;
      return map;
    },
    {}
  );

  const weaponsMap = weapons.reduce<Record<string, Weapon>>((map, value) => {
    map[value.id] = value;
    return map;
  }, {});

  return {
    props: { characters: charactersMap, weapons: weaponsMap, lngDict },
    revalidate: 1,
  };
};

export default AscensionPlanner;
