import clsx from "clsx";
import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import CharacterBlock from "@components/hsr/CharacterBlock";
import useTranslations from "@hooks/use-translations";
import type { Character, Tiers } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrId } from "@utils/helpers";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 86400;

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
  const { t, locale } = await useTranslations(params.lang, "hsr", "tierlist");
  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail Tier List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover a comprehensive tier list ranks all the 5-Star, 4-Star, DPS, and support characters in HSR, allowing you to make informed decisions about your team composition. Stay ahead of the competition and unleash the true potential of your squad with our expertly curated guide. Explore the Tier List and uncover the powerhouses that will lead you to victory in Honkai: Star Rail.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/tierlist`,
    locale,
  });
}

export default async function HSRTierlistPage({ params }: Props) {
  const { t, langData } = await useTranslations(params.lang, "hsr", "tierlist");

  const characters = await getHSRData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "rarity", "combat_type", "path"],
  });

  const tierlist = await getHSRData<Tiers>({
    resource: "tierlists",
    language: langData,
    filter: {
      id: "overall",
    },
  });

  const charactersMap = characters.reduce(
    (acc, character) => {
      acc[character.id] = character;
      return acc;
    },
    {} as Record<string, Character>
  );

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t({
            id: "tierlist",
            defaultMessage: "Tierlist",
          })}
        </h2>
        <p className="px-2 text-sm">
          {t({
            id: "tierlist_desc",
            defaultMessage:
              "Explore the Ultimate Honkai: Star Rail Tier List! Discover the top-performing characters in HSR, including 5-Star, 4-Star, DPS, and support characters, all expertly ranked in this comprehensive guide. Stay ahead of the game and make informed choices with this invaluable resource.",
          })}
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="mt-4 flex flex-col bg-hsr-surface2 shadow-2xl">
        {Object.entries(tierlist)
          .filter(([key]) => key !== "id")
          .map(([tier, tierCharacters]) => (
            <div
              key={tier}
              className="flex items-center border-b border-accent-1 py-2 last:border-b-0"
            >
              <div
                className={clsx(
                  "w-16 shrink-0 flex-grow-0 text-center text-2xl font-semibold",
                  {
                    "text-red-500": tier === "SS",
                    "text-yellow-500": tier === "S",
                    "text-green-500": tier === "A",
                    "text-blue-500": tier === "B",
                    "text-gray-500": tier === "C",
                  }
                )}
              >
                {tier}
              </div>
              <div className="flex flex-wrap">
                {tierCharacters.map((characterId: string) => {
                  const char = charactersMap[getHsrId(characterId)];

                  if (!char) {
                    console.log("Character not found", characterId);
                    return null;
                  }

                  return (
                    <Link
                      key={characterId}
                      href={`/${params.lang}/hsr/character/${char.id}`}
                      className="mx-2"
                      prefetch={false}
                    >
                      <CharacterBlock key={characterId} character={char} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
