import { CharacterTier, Tierlist } from "interfaces/tierlist";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import GenshinTierlistView from "./list";

export const revalidate = 86400;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.tierlist",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/tier-list`,
    locale: lang,
  });
}

export default async function GenshinTierlist({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.tierlist");
  const langData = getLangData(lang, "genshin");

  const characters = await getGenshinData<Record<string, Character[]>>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "element"],
    asMap: true,
  });
  const weapons = await getGenshinData<Record<string, Weapon[]>>({
    resource: "weapons",
    language: langData,
    select: ["id", "name", "rarity"],
    asMap: true,
  });
  const artifacts = await getGenshinData<Record<string, Artifact[]>>({
    resource: "artifacts",
    language: langData,
    select: ["id", "name"],
    asMap: true,
  });

  const tierlist = await getGenshinData<Record<string, Tierlist>>({
    resource: "tierlists",
    language: langData,
    filter: { id: "characters" },
  });

  const _tiers = ["0", "1", "2", "3", "4"];

  const mergeTiers = (col: any, tiers: string[]) => {
    return tiers.reduce<CharacterTier[]>((data, k) => [...data, ...col[k]], []);
  };

  const charactersMap: any = {};
  const weaponsMap: any = {};
  const artifactsMap: any = {};
  const mergedTierlist = [
    ...mergeTiers(tierlist.tierlist.maindps, _tiers),
    ...mergeTiers(tierlist.tierlist.subdps, _tiers),
    ...mergeTiers(tierlist.tierlist.support, _tiers),

    ...mergeTiers(tierlist["tierlist_c0"].maindps, _tiers),
    ...mergeTiers(tierlist["tierlist_c0"].subdps, _tiers),
    ...mergeTiers(tierlist["tierlist_c0"].support, _tiers),

    ...mergeTiers(tierlist["tierlist_c6"].maindps, _tiers),
    ...mergeTiers(tierlist["tierlist_c6"].subdps, _tiers),
    ...mergeTiers(tierlist["tierlist_c6"].support, _tiers),
  ];

  for (const tl of mergedTierlist) {
    charactersMap[tl.id] = characters[tl.id];
    weaponsMap[tl.w_id] = weapons[tl.w_id];
    tl.a_ids?.forEach((a_id: string) => {
      artifactsMap[a_id] = artifacts[a_id];
    });
  }

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-center text-2xl font-semibold text-gray-200 lg:text-left">
        {t("title")}
      </h2>
      <GenshinTierlistView
        artifactsMap={artifactsMap}
        charactersMap={charactersMap}
        weaponsMap={weaponsMap}
        tierlist={tierlist.tierlist}
        tierlistCZero={tierlist.tierlist_c0}
        tierlistCSix={tierlist.tierlist_c6}
      />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
