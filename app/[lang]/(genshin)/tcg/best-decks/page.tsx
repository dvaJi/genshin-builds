import GenshinData, { type TCGCard } from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";
import { getRemoteData } from "@lib/localData";
import Link from "next/link";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "tcg_decks"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genius Invokation TCG Card Game",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Genius Invokation TCG is a new card game feature in Genshin Impact. Guide includes what is the Genius Invocation TCG, character card game, how to get cards!",
  });

  return genPageMetadata({
    title,
    description,
    path: `/tcg/best-decks`,
    locale,
  });
}

export default async function GenshinBestDecks({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "tcg_decks"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const bestDecks = await getRemoteData<
    {
      c: string[];
      a: string[];
    }[]
  >("genshin", "tcg-bestdecks");

  const cCharacters = await genshinData.tcgCharacters({
    select: ["id", "name"],
  });
  const cActions = await genshinData.tcgActions({
    select: ["id", "name"],
  });

  const decks = bestDecks.map((deck) => {
    return {
      characters: deck.c.map(
        (c: string) => cCharacters.find((cc) => cc.id === c) as TCGCard
      ),
      actions: deck.a.map((a: string) => ({
        ...(cActions.find((aa) => aa.id === a.split("|")[0]) as TCGCard),
        count: a.split("|")[1],
      })),
    };
  });

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "best_decks", defaultMessage: "Best Decks" })}
      </h2>
      <div>
        {decks.map((deck, i) => (
          <div className="card" key={deck.characters[0].id + i}>
            <div className="flex flex-col">
              <div className="flex flex-wrap content-center justify-center">
                {deck.characters.map((card) => (
                  <Link
                    key={card.id}
                    href={`/tcg/card/${card.id}`}
                    className="group relative cursor-pointer transition-all"
                  >
                    <img
                      src={getUrl(`/tcg/${card.id}.png`, 170, 310)}
                      alt={card.name}
                      title={card.name}
                      className="w-28 rounded-xl border-2 border-transparent transition-all group-hover:border-white group-hover:brightness-125 md:w-36"
                    />
                    <div className="text-center text-sm transition-all group-hover:text-white">
                      {card.name}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="relative flex flex-wrap content-center justify-center">
                {deck.actions.map((card) => (
                  <Link
                    key={card.id}
                    href={`/tcg/card/${card.id}`}
                    className="group relative m-2 w-20 cursor-pointer transition-all"
                  >
                    <img
                      src={getUrl(`/tcg/${card.id}.png`, 95, 150)}
                      alt={card.name}
                      title={card.name}
                      width={90}
                      height={144}
                      className="rounded-lg border-2 border-transparent transition-all group-hover:border-white group-hover:brightness-125"
                    />
                    <div className="mt-1 text-center text-xs transition-all group-hover:text-white">
                      {card.name}{" "}
                      <span className="text-white">x{card.count}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {i % 2 === 0 ? (
              <FrstAds
                placementName="genshinbuilds_incontent_1"
                classList={["flex", "justify-center"]}
              />
            ) : null}
          </div>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
