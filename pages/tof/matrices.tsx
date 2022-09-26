import CharacterPortrait from "@components/tof/CharacterPortrait";
import { TOF_IMGS_CDN } from "@lib/constants";

import { getLocale } from "@lib/localData";
import { getCharacters } from "@lib/tofdata";
import { setBackground } from "@state/background-atom";
import { Character } from "interfaces/tof/character";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  characters: Character[];
};

function Characters({ characters }: Props) {
  useEffect(() => {
    setBackground({
      image: `${TOF_IMGS_CDN}/bg/fulilingqu_bg_OS1.png`,
      gradient: {
        background: "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
      },
    });
  }, []);
  return (
    <div>
      <h2>Characters</h2>
      <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 py-4 px-4 shadow-lg md:grid-cols-3 lg:grid-cols-4">
        {characters.map((character) => (
          <Link key={character.id} href={`/tof/character/${character.id}`}>
            <a>
              <CharacterPortrait character={character} key={character.id} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const characters = getCharacters(locale);

  return {
    props: {
      characters: characters.map((c) => ({
        id: c.id,
        name: c.name,
        weapon_id: c.weapon_id,
        weapon: c.weapon,
      })),
      lngDict,
    },
  };
};

export default Characters;
