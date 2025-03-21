import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import type { TierlistWeapons } from "@interfaces/wuthering-waves/tierlist-weapons";
import type { Weapons } from "@interfaces/wuthering-waves/weapons";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

import Tier from "./tier";

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
    namespace: "WW.tierlist_weapons",
  });

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/wuthering-waves/tierlist/weapons`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("WW.tierlist_weapons");
  const langData = getLangData(lang, "wuthering-waves");

  const tierlist = await getWWData<TierlistWeapons>({
    resource: "tierlist",
    filter: {
      id: "weapons",
    },
  });

  const weapons = await getWWData<Record<string, Weapons>>({
    resource: "weapons",
    language: langData,
    select: ["id", "name", "rarity", "icon"],
    asMap: true,
  });

  return (
    <div>
      <div className="mx-1 my-2 md:mx-0">
        <h2 className="text-2xl text-ww-100">{t("main_title")}</h2>
        <p>{t("main_description")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="mx-2 my-4 flex gap-4 md:mx-0">
        <a
          href="#sword"
          className="rounded-md border border-ww-700 bg-ww-950 px-2 py-2 hover:opacity-80"
        >
          {t("sword")}
        </a>
        <a
          href="#broadblade"
          className="rounded-md border border-ww-700 bg-ww-950 px-2 py-2 hover:opacity-80"
        >
          {t("broadblade")}
        </a>
        <a
          href="#gauntlet"
          className="rounded-md border border-ww-700 bg-ww-950 px-2 py-2 hover:opacity-80"
        >
          {t("gauntlet")}
        </a>
        <a
          href="#rectifier"
          className="rounded-md border border-ww-700 bg-ww-950 px-2 py-2 hover:opacity-80"
        >
          {t("rectifier")}
        </a>
        <a
          href="#pistol"
          className="rounded-md border border-ww-700 bg-ww-950 px-2 py-2 hover:opacity-80"
        >
          {t("pistol")}
        </a>
      </div>
      <h2 id="sword" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("swords_tierlist")}
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.sword ?? {}).map(([tier, chars]) => (
          <Tier
            key={"sword" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 id="broadblade" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("broadblades_tierlist")}
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.broadblade ?? {}).map(([tier, chars]) => (
          <Tier
            key={"broadblade" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 id="gauntlet" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("gauntlets_tierlist")}
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.gauntlet ?? {}).map(([tier, chars]) => (
          <Tier
            key={"gauntlet" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 id="rectifier" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("rectifiers_tierlist")}
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.rectifier ?? {}).map(([tier, chars]) => (
          <Tier
            key={"rectifier" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 id="pistol" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("pistols_tierlist")}
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.pistol ?? {}).map(([tier, chars]) => (
          <Tier
            key={"pistol" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
    </div>
  );
}
