import { GetStaticProps } from "next";

import charactersData from "../utils/characters.json";
import { Character } from "../interfaces/character";

type Props = {
  characters: Character[];
};

const CharactersPage = ({ characters }: Props) => (
  <div>
    <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      Characters
    </h2>
    <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-vulcan-800 relative">
      <ul>
        {characters.map((character) => (
          <li key={character.id}>{character.name}</li>
        ))}
      </ul>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const characters = charactersData as Character[];
  return { props: { characters }, revalidate: 1 };
};

export default CharactersPage;
