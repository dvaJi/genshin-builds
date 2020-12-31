import { GetStaticProps } from "next";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { Character } from "../../interfaces/character";
import { appBackgroundStyleState } from "../../state/background-atom";
import charactersData from "../../_content/data/characters.json";

interface CharacterPageProps {
  character: Character;
}

const CharacterPage = ({ character }: CharacterPageProps) => {
  const setBg = useSetRecoilState(appBackgroundStyleState);
  useEffect(() => {
    setBg({
      image: `/characters/bg/${character.name}_bg.jpg`,
      gradient: {
        background: "transparent",
      },
    });
  }, [character]);
  return (
    <div>
      <div className="flex items-start justify-between mr-6">
        <div className="flex">
          <div className="relative mr-8">
            <img
              className="w-36 h-36 bg-vulcan-800 p-1 rounded-full border border-gray-900"
              src={`/characters/portrait/${character.name}.png`}
              alt={character.name}
            />
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex items-center mr-2">
              <h1>{character.name}</h1>
            </div>
          </div>
        </div>
      </div>
      <div>nav</div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const character = (charactersData as Character[]).find(
    (c) => c.name.replace(/\s/, "") === params?.name
  );

  return {
    props: { character },
    revalidate: 1,
  };
};

export async function getStaticPaths() {
  const characters = charactersData as Character[];

  return {
    paths: characters.map((character) => {
      return {
        params: {
          name: character.name.replace(/\s/, ""),
        },
      };
    }),
    fallback: false,
  };
}

export default CharacterPage;
