import type { Character } from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getRemoteData } from "@lib/localData";
import { Tierlist } from "interfaces/tierlist";
import GenshinTierlistView from "./list";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

export const revalidate = 86400;

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
    "tierlist"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Tier List (Best Characters)",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/tier-list`,
    locale,
  });
}

export default async function GenshinTierlist({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "tierlist"
  );

  const characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "element"],
  });
  const weapons = await getGenshinData<Character[]>({
    resource: "weapons",
    language: langData,
    select: ["id", "name", "rarity"],
  });
  const artifacts = await getGenshinData<Character[]>({
    resource: "artifacts",
    language: langData,
    select: ["id", "name"],
  });

  const tierlist = await getRemoteData<Record<string, Tierlist>>(
    "genshin",
    "tierlist-characters"
  );

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
  const artifactsMap: any = {};
  const mergedTierlist = [
    ...mergeTiers(tierlist.tierlist.maindps),
    ...mergeTiers(tierlist.tierlist.subdps),
    ...mergeTiers(tierlist.tierlist.support),

    ...mergeTiers(tierlist["tierlist_c0"].maindps),
    ...mergeTiers(tierlist["tierlist_c0"].subdps),
    ...mergeTiers(tierlist["tierlist_c0"].support),

    ...mergeTiers(tierlist["tierlist_c6"].maindps),
    ...mergeTiers(tierlist["tierlist_c6"].subdps),
    ...mergeTiers(tierlist["tierlist_c6"].support),
  ];

  for (const tl of mergedTierlist) {
    charactersMap[tl.id] = characters.find((c) => c.id === tl.id);
    weaponsMap[tl.w_id] = weapons.find((w) => w.id === tl.w_id);
    tl.a_ids.forEach((a_id: string) => {
      artifactsMap[a_id] = artifacts.find((a) => a.id === a_id);
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
        {t({
          id: "title",
          defaultMessage: "Genshin Impact Best Characters Tier List",
        })}
      </h2>
      <GenshinTierlistView
        artifactsMap={artifactsMap}
        charactersMap={charactersMap}
        weaponsMap={weaponsMap}
        tierlist={tierlist.tierlist}
        tierlistCZero={tierlist.tierlist_c0}
        tierlistCSix={tierlist.tierlist_c6}
      />
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
