import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { cn } from "@app/lib/utils";
import { genPageMetadata } from "@app/seo";
import CharacterBlock from "@components/hsr/CharacterBlock";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { Character, Tiers } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrId } from "@utils/helpers";

export const dynamic = "force-static";
export const revalidate = 86400;
export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "HSR.tierlist",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/hsr/tierlist`,
    locale: lang,
  });
}

export default async function HSRTierlistPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.tierlist");
  const langData = getLangData(lang, "hsr");

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
    {} as Record<string, Character>,
  );

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t("tierlist")}
        </h2>
        <p className="px-2 text-sm">{t("tierlist_desc")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="mt-4 flex flex-col">
        {Object.entries(tierlist)
          .filter(([key]) => key !== "id")
          .map(([tier, tierCharacters]) => (
            <div
              key={tier}
              className="flex items-center border-b border-border py-2 last:border-b-0"
            >
              <div
                className={cn(
                  "w-16 shrink-0 flex-grow-0 text-center text-2xl font-semibold",
                  {
                    "text-red-500": tier === "SS",
                    "text-yellow-500": tier === "S",
                    "text-green-500": tier === "A",
                    "text-blue-500": tier === "B",
                    "text-gray-500": tier === "C",
                  },
                )}
              >
                {tier}
              </div>
              <div className="flex flex-wrap gap-2">
                {tierCharacters.map((characterId: string) => {
                  const char = charactersMap[getHsrId(characterId)];

                  if (!char) {
                    console.log("Character not found", characterId);
                    return null;
                  }

                  return (
                    <Link
                      key={characterId}
                      href={`/hsr/character/${char.id}`}
                      className="max-w-28"
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
