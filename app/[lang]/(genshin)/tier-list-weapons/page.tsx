import { TierlistWeapons } from "interfaces/tierlist";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import GenshinTierlistWeaponsView from "./list";

export const revalidate = 86400;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(
    lang,
    "genshin",
    "tierlist_weapons"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Weapons Tier List (Best Weapons)",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "All the best weapons ranked in order of power, viability, and versatility to clear content.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/tier-list-weapons`,
    locale,
  });
}

export default async function GenshinTierlistWeapons({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "genshin",
    "tierlist_weapons"
  );

  const weaponsMap = await getGenshinData<Record<string, Weapon>>({
    resource: "weapons",
    language: langData,
    asMap: true,
  });
  const tierlist = await getGenshinData<Record<string, TierlistWeapons>>({
    resource: "tierlists",
    language: langData,
    filter: { id: "weapons" },
  });

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-center text-2xl font-semibold text-gray-200 lg:text-left">
        {t({
          id: "title",
          defaultMessage: "Genshin Impact Weapons Tier List (Best Weapons)",
        })}
      </h2>
      <GenshinTierlistWeaponsView weaponsMap={weaponsMap} tierlist={tierlist} />
      <span className="text-xs">
        Source:{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://genshin-impact.fandom.com/wiki/Fishing#Fishing_Points"
        >
          GenshinWiki
        </a>
      </span>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
