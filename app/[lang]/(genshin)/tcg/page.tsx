import type { TCGCard } from "genshin-data";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

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
    "tcg_cards"
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
    path: `/tcg`,
    locale,
  });
}

export default async function GenshinTCG({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "tcg_cards"
  );

  const cards = await getGenshinData<TCGCard[]>({
    resource: "tcgCards",
    language: langData,
  });

  // // Gather all types from card.attributes.card_type without duplicates
  // const types = cards
  //   .map((card) => card?.attributes?.card_type)
  //   .filter((value, index, self) => value && self.indexOf(value) === index);

  // // Gather all energies from card.attributes.energy without duplicates
  // const energies = cards
  //   .map((card) => card?.attributes?.energy)
  //   .filter((value, index, self) => value && self.indexOf(value) === index);

  // // Gather all costs from card.attributes.cost without duplicates
  // const costs = cards
  //   .map((card) => card?.attributes?.cost)
  //   .filter((value, index, self) => value && self.indexOf(value) === index);

  // // Gather all factions from card.attributes.faction without duplicates, faction is an array of strings
  // const factions = cards
  //   .flatMap((card) => card?.attributes?.faction)
  //   .filter((value, index, self) => value && self.indexOf(value) === index);

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "cards", defaultMessage: "Cards" })}
      </h2>
      <div className="card flex flex-wrap content-center justify-center">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/${params.lang}/tcg/card/${card.id}`}
            className="group relative m-2 w-20 cursor-pointer transition-all hover:scale-110"
          >
            <img
              src={getUrl(`/tcg/${card.id}.png`, 150, 90)}
              alt={card.name}
              title={card.name}
              width={80}
              height={134}
              className="rounded-lg border-2 border-transparent transition-all group-hover:border-white group-hover:brightness-125"
            />
            <div className="mt-1 text-center text-xs transition-all group-hover:text-white">
              {card.name}
            </div>
          </Link>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
