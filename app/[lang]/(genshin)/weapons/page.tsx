import { i18n } from "i18n-config";
import { Beta } from "interfaces/genshin/beta";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getData } from "@lib/localData";

import WeaponsList from "./list";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "weapons");
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Weapons List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "All the best weapons, locations, and stats, including Bows, Catalysts, Claymores, Swords, and Polearms.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/weapons`,
    locale,
  });
}

export default async function GenshinCharacters({ params }: Props) {
  const { lang } = await params;
  const { t, langData, locale } = await getTranslations(
    lang,
    "genshin",
    "weapons"
  );

  const weapons = await getGenshinData<Weapon[]>({
    resource: "weapons",
    language: langData,
    select: ["id", "rarity", "name", "type"],
  });

  const beta = await getData<Beta>("genshin", "beta");

  const allWeapons = [
    ...(beta[locale]?.weapons ?? []).map((c: any) => {
      const { id, name, type, rarity } = c;
      return { id, name, type, rarity, beta: true };
    }),
    ...weapons.sort((a, b) => {
      return b.rarity - a.rarity || a.name.localeCompare(b.name);
    }),
  ] as (Weapon & { beta?: boolean })[];

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "weapons", defaultMessage: "Weapons" })}
      </h2>
      <WeaponsList weapons={allWeapons} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
