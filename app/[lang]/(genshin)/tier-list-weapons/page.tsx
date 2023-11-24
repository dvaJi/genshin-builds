import GenshinData from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import GenshinTierlistWeaponsView from "./list";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";
import { TierlistWeapons } from "interfaces/tierlist";

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
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "tierlist_weapons"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const tierlist = await getRemoteData<Record<string, TierlistWeapons>>(
    "genshin",
    "tierlist-weapons"
  );
  const weaponsMap = weapons.reduce(
    (map, { id, ...weapon }) => ({ ...map, [id]: weapon }),
    {}
  );

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
