import { Beta } from "interfaces/genshin/beta";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getData } from "@lib/localData";

import WeaponsList from "./list";

export const dynamic = "force-static";
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
    namespace: "Genshin.weapons",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/weapons`,
    locale: lang,
  });
}

export default async function GenshinWeapons({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.weapons");
  const langData = getLangData(lang, "genshin");

  const weapons = await getGenshinData<Weapon[]>({
    resource: "weapons",
    language: langData,
    select: ["id", "rarity", "name", "type"],
  });

  const weaponTypes = weapons.reduce((acc, weapon) => {
    if (!acc.includes(weapon.type.id)) {
      acc.push(weapon.type.id);
    }
    return acc;
  }, [] as string[]);

  const beta = await getData<Beta>("genshin", "beta");

  const allWeapons = [
    ...(beta[lang]?.weapons ?? []).map((w: any) => {
      const { id, name, type, rarity } = w;
      return { id, name, type, rarity, beta: true };
    }),
    ...weapons,
  ] as (Weapon & { beta?: boolean })[];

  return (
    <div className="min-h-screen px-2 sm:px-0">
      <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:mb-8 sm:gap-4 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("weapons")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
        </div>
        <Ads className="hidden md:block" adSlot={AD_ARTICLE_SLOT} />
      </div>

      <div className="mb-4 sm:mb-8">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
      </div>

      <div className="card overflow-hidden">
        <WeaponsList weapons={allWeapons} weaponTypes={weaponTypes} />
      </div>

      <div className="mt-4 sm:mt-8">
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
      </div>
    </div>
  );
}
