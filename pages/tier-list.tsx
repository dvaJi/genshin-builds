import { GetStaticProps } from "next";
import Link from "next/link";
import GenshinData, { Character } from "genshin-data";

import { localeToLang } from "@utils/locale-to-lang";
import { Tierlist } from "genshin-data/dist/types/tierlist";
import useIntl from "@hooks/use-intl";
import CharacterPortrait from "@components/CharacterPortrait";

type Props = {
  tierlist: Tierlist;
  charactersMap: Record<string, Pick<Character, "id" | "name" | "element">>;
  lngDict: Record<string, string>;
};

const TierList = ({ tierlist, charactersMap, lngDict }: Props) => {
  const [f] = useIntl(lngDict);
  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({
          id: "tierlist.title",
          defaultMessage: "Genshin Impact Best Characters Tier List",
        })}
      </h2>
      <div className="rounded">
        <div className="grid grid-cols-8 gap-4 w-full">
          <div className="p-5"></div>
          <div className="col-span-2 p-5 bg-vulcan-800">
            <h3 className="text-lg text-white text-center font-semibold">
              Main DPS
            </h3>
          </div>
          <div className="col-span-2 p-5 bg-vulcan-800">
            <h3 className="text-lg text-white text-center font-semibold">
              Sub DPS
            </h3>
          </div>
          <div className="col-span-2 p-5 bg-vulcan-800">
            <h3 className="text-lg text-white text-center font-semibold">
              Support
            </h3>
          </div>
        </div>
        <CharactersTier
          tierlist={tierlist}
          characters={charactersMap}
          tier={"0"}
        />
        <CharactersTier
          tierlist={tierlist}
          characters={charactersMap}
          tier={"1"}
        />
        <CharactersTier
          tierlist={tierlist}
          characters={charactersMap}
          tier={"2"}
        />
        <CharactersTier
          tierlist={tierlist}
          characters={charactersMap}
          tier={"3"}
        />
      </div>
    </div>
  );
};

type CharactersTierProps = {
  tierlist: Tierlist;
  tier: "0" | "1" | "2" | "3";
  characters: Record<string, Pick<Character, "id" | "name" | "element">>;
};

function CharactersTier({ tierlist, tier, characters }: CharactersTierProps) {
  return (
    <div className="grid grid-cols-8 gap-4 w-full">
      <div className="p-5 bg bg-vulcan-900 bg-opacity-50">
        <h3 className="text-2xl text-white text-center font-bold">T{tier}</h3>
      </div>
      <div className="col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
        {tierlist.maindps[tier].map((t) => (
          <div className="inline-block">
            <Link key={t.id} href={`/character/${t.id}`}>
              <a>
                <CharacterPortrait
                  character={{ ...characters[t.id], constellation: t.min_c }}
                />
              </a>
            </Link>
          </div>
        ))}
      </div>
      <div className="col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
        {tierlist.subdps[tier].map((t) => (
          <div className="inline-block">
            <Link key={t.id} href={`/character/${t.id}`}>
              <a>
                <CharacterPortrait
                  character={{ ...characters[t.id], constellation: t.min_c }}
                />
              </a>
            </Link>
          </div>
        ))}
      </div>
      <div className="col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
        {tierlist.support[tier].map((t) => (
          <div className="inline-block">
            <Link key={t.id} href={`/character/${t.id}`}>
              <a>
                <CharacterPortrait
                  character={{ ...characters[t.id], constellation: t.min_c }}
                />
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters();
  const tierlist = await genshinData.tierlist();

  const charactersMap: any = {};
  for (const character of characters) {
    charactersMap[character.id] = {
      id: character.id,
      name: character.name,
      element: character.element,
    };
  }

  return {
    props: {
      tierlist,
      charactersMap,
      lngDict,
    },
    revalidate: 1,
  };
};

export default TierList;
