import { GetStaticProps } from "next";
import Link from "next/link";
import GenshinData, { Character, Weapon } from "genshin-data";

import CharacterPortrait from "@components/CharacterPortrait";
import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { Tierlist } from "interfaces/tierlist";
import { getLocale } from "@lib/localData";

type Props = {
  tierlist: Tierlist;
  charactersMap: Record<string, Pick<Character, "id" | "name" | "element">>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  lngDict: Record<string, string>;
  common: Record<string, string>;
};

const TierList = ({
  tierlist,
  charactersMap,
  weaponsMap,
  lngDict,
  common,
}: Props) => {
  const [f, fn] = useIntl(lngDict);
  return (
    <div>
      <Metadata
        fn={fn}
        pageTitle={fn({
          id: "title.tierlist",
          defaultMessage: "Genshin Impact Tier List (Best Characters)",
        })}
        pageDescription={fn({
          id: "title.tierlist.description",
          defaultMessage:
            "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({
          id: "title.tierlist",
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
          weaponsMap={weaponsMap}
          tier={"0"}
          common={common}
        />
        <CharactersTier
          tierlist={tierlist}
          characters={charactersMap}
          weaponsMap={weaponsMap}
          tier={"1"}
          common={common}
        />
        <CharactersTier
          tierlist={tierlist}
          characters={charactersMap}
          weaponsMap={weaponsMap}
          tier={"2"}
          common={common}
        />
        <CharactersTier
          tierlist={tierlist}
          characters={charactersMap}
          weaponsMap={weaponsMap}
          tier={"3"}
          common={common}
        />
        <CharactersTier
          tierlist={tierlist}
          characters={charactersMap}
          weaponsMap={weaponsMap}
          tier={"4"}
          common={common}
        />
      </div>
    </div>
  );
};

type CharactersTierProps = {
  tierlist: Tierlist;
  tier: "0" | "1" | "2" | "3" | "4";
  characters: Record<string, Pick<Character, "id" | "name" | "element">>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  common: Record<string, string>;
};

function CharactersTier({
  tierlist,
  tier,
  characters,
  weaponsMap,
  common,
}: CharactersTierProps) {
  return (
    <div className="grid grid-cols-8 gap-4 w-full">
      <div className="p-5 bg bg-vulcan-900 bg-opacity-50">
        <h3 className="text-2xl text-white text-center font-bold">T{tier}</h3>
      </div>
      <div className="col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
        {tierlist.maindps[tier].map((t) => (
          <div key={t.id} className="inline-block">
            <Link href={`/character/${t.id}`}>
              <a>
                <CharacterPortrait
                  character={{
                    ...characters[t.id],
                    constellationNum: t.min_c,
                    element: common[characters[t.id].element],
                  }}
                  weapon={weaponsMap[t.w_id]}
                />
              </a>
            </Link>
          </div>
        ))}
      </div>
      <div className="col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
        {tierlist.subdps[tier].map((t) => (
          <div key={t.id} className="inline-block">
            <Link href={`/character/${t.id}`}>
              <a>
                <CharacterPortrait
                  character={{
                    ...characters[t.id],
                    constellationNum: t.min_c,
                    element: common[characters[t.id].element],
                  }}
                  weapon={weaponsMap[t.w_id]}
                />
              </a>
            </Link>
          </div>
        ))}
      </div>
      <div className="col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
        {tierlist.support[tier].map((t) => (
          <div key={t.id} className="inline-block relative">
            <Link href={`/character/${t.id}`}>
              <a>
                <CharacterPortrait
                  character={{
                    ...characters[t.id],
                    constellationNum: t.min_c,
                    element: common[characters[t.id].element],
                  }}
                  weapon={weaponsMap[t.w_id]}
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
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "element"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const { default: tierlist = {} }: any = await import(
    `../_content/data/tierlist.json`
  );
  const common = require(`../_content/data/common_${locale}.json`);

  const tiers = ["0", "1", "2", "3", "4"];

  const mergeTiers = (col: any) => {
    let data: any[] = [];
    tiers.forEach((k) => {
      data = [...data, ...col[k]];
    });

    return data;
  };

  const charactersMap: any = {};
  const weaponsMap: any = {};
  const mergedTierlist = [
    ...mergeTiers(tierlist.maindps),
    ...mergeTiers(tierlist.subdps),
    ...mergeTiers(tierlist.support),
  ];

  for (const tl of mergedTierlist) {
    charactersMap[tl.id] = characters.find((c) => c.id === tl.id);
    weaponsMap[tl.w_id] = weapons.find((w) => w.id === tl.w_id);
  }

  return {
    props: {
      tierlist,
      charactersMap,
      weaponsMap,
      lngDict,
      common,
    },
    revalidate: 1,
  };
};

export default TierList;
