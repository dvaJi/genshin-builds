import Link from "next/link";
import dynamic from "next/dynamic";
import { type GetStaticProps } from "next";
import GenshinData, { type TCGCard } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Card from "@components/ui/Card";

import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { getUrl } from "@lib/imgUrl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import Metadata from "@components/Metadata";
import useIntl from "@hooks/use-intl";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

type Props = {
  decks: { characters: TCGCard[]; actions: ({ count: number } & TCGCard)[] }[];
};

function BestDecks({ decks }: Props) {
  const { t } = useIntl("tcg_decks");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genius Invokation TCG Card Game",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Genius Invokation TCG is a new card game feature in Genshin Impact. Guide includes what is the Genius Invocation TCG, character card game, how to get cards!",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "best_decks", defaultMessage: "Best Decks" })}
      </h2>
      <div>
        {decks.map((deck, i) => (
          <Card key={deck.characters[0].id + i}>
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
                    <LazyLoadImage
                      src={getUrl(`/tcg/${card.id}.png`, 95, 150)}
                      placeholderSrc={getUrl(`/tcg/${card.id}.png`, 4, 4)}
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
          </Card>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const bestDecks = require(`../../_content/genshin/data/bestdecks.json`) as {
    c: string[];
    a: string[];
  }[];

  const cCharacters = await genshinData.tcgCharacters({
    select: ["id", "name", "attributes"],
  });
  const cActions = await genshinData.tcgActions({
    select: ["id", "name", "attributes"],
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

  return {
    props: { lngDict, decks },
  };
};

export default BestDecks;
