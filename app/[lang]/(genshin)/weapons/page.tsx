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

export default async function GenshinWeapons({ params }: Props) {
  const { lang } = await params;
  const { t, locale, langData } = await getTranslations(
    lang,
    "genshin",
    "weapons"
  );

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
    ...(beta[locale]?.weapons ?? []).map((w: any) => {
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
            {t({ id: "weapons", defaultMessage: "Weapons" })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-lg">
            {t({
              id: "description",
              defaultMessage:
                "All the best weapons, locations, and stats, including Bows, Catalysts, Claymores, Swords, and Polearms.",
            })}
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
