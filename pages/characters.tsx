import { GetStaticProps } from "next";

import charactersData from "../utils/characters.json";
import { Character } from "../interfaces/character";

type Props = {
  characters: Character[];
};

const CharactersPage = ({ characters }: Props) => (
  <div>
    <h2>Weaponms</h2>
    <div>
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
