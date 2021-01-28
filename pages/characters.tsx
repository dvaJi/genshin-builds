import { GetStaticProps } from "next";
import GenshinData from "genshin-data";

import { Character } from "genshin-data/dist/types/character";
import CharacterPortrait from "../components/CharacterPortrait";
import ElementIcon from "../components/ElementIcon";

type CharactersProps = {
  charactersByElement: Record<string, Character[]>;
  elements: string[];
};

const CharactersPage = ({ charactersByElement, elements }: CharactersProps) => {
  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-200">Characters</h2>
      <div className="">
        {elements.map((element) => (
          <div className="mb-3 p-5 rounded border border-gray-800 bg-no-repeat bg-fixed bg-center">
            <div className="flex self-center mb-2">
              <ElementIcon type={element} height={32} width={32} />
              <h3 className="text-2xl font-bold ml-2">{element}</h3>
            </div>

            <div className="flex justify-center items-center flex-wrap">
              {charactersByElement[element].map((character) => (
                <CharacterPortrait
                  key={character.id}
                  character={character as any}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const genshinData = new GenshinData();
  const characters = await genshinData.characters();
  const elements: string[] = [];
  const charactersByElement = characters.reduce<Record<string, Character[]>>(
    (map, value) => {
      if (map[value.element]) {
        map[value.element].push(value);
      } else {
        elements.push(value.element);
        map[value.element] = [value];
      }

      return map;
    },
    {}
  );

  return {
    props: { charactersByElement, elements },
    revalidate: 1,
  };
};

export default CharactersPage;
