import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TooltipProvider } from "@app/components/ui/tooltip";
import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { Character, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import { CharacterCalculator } from "./character-calculator";
import { FateCountCalculatorForm } from "./fate-count-calculator";
import { FatePriceCalculatorForm } from "./fate-price-calculator";
import { FriendshipExpCalculatorForm } from "./friendship-exp-calculator";
import { LevelUpTable } from "./levelup-table";
import { ResinCalculatorForm } from "./resin-calculator-form";
import { ResinTable } from "./resin-table";
import { WeaponCalculator } from "./weapon-calculator";

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
    namespace: "Genshin.calculator",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/calculator`,
    locale: lang,
  });
}

export default async function GenshinCalculator({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.calculator");
  const langData = getLangData(lang, "genshin");

  const characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["_id", "id", "name"],
  });
  const weapons = (
    await getGenshinData<Weapon[]>({
      resource: "weapons",
      language: langData,
      select: ["id", "name", "rarity"],
    })
  ).filter((w) => w.rarity > 2);

  const dict = {
    quantity: t("quantity"),
    time: t("time"),
    original_resin: t("original_resin"),
    adventurers_experience: t("adventurers_experience"),
    heros_wit: t("heros_wit"),
    items: t("items"),
    level: t("level"),
    mora: t("mora"),
    wanderes_advice: t("wanderers_advice"),
    wasted: t("wasted"),
  };

  return (
    <div className="w-full">
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t("calculator")}
      </h2>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <TooltipProvider>
        <div>
          <h3 className="text-xl text-white">
            {t("character_ascension_calculator")}
          </h3>
          <p>{t("character_ascension_calculator_desc")}</p>
        </div>
        <div className="card">
          <CharacterCalculator characters={characters} />
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="mt-6">
          <h3 className="text-xl text-white">
            {t("weapon_ascension_calculator")}
          </h3>
          <p>{t("weapon_ascension_calculator_desc")}</p>
        </div>
        <div className="card">
          <WeaponCalculator weapons={weapons} />
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="mt-6">
          <h3 className="text-xl text-white">{t("resin_calculator")}</h3>
          <p>{t("resin_calculator_desc")}</p>
        </div>
        <ResinCalculatorForm />
        <div className="mt-6">
          <h3 className="text-xl text-white">
            {t("friendship_exp_calculator")}
          </h3>
          <p>{t("friendship_exp_calculator_desc")}</p>
        </div>
        <FriendshipExpCalculatorForm />
        <div className="mt-6">
          <h3 className="text-xl text-white">{t("fate_price_calculator")}</h3>
          <p>{t("fate_price_calculator_desc")}</p>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_2"
          classList={["flex", "justify-center"]}
        />
        <FatePriceCalculatorForm />
        <div className="mt-6">
          <h3 className="text-xl text-white">{t("fate_count_calculator")}</h3>
          <p>{t("fate_count_calculator_desc")}</p>
        </div>
        <FateCountCalculatorForm />
        <div className="flex justify-between gap-4">
          <LevelUpTable
            adventurers_experience={dict.adventurers_experience}
            heros_wit={dict.heros_wit}
            items={dict.items}
            level={dict.level}
            mora={dict.mora}
            wanderes_advice={dict.wanderes_advice}
            wasted={dict.wasted}
          />
          <ResinTable
            quantity={dict.quantity}
            time={dict.time}
            originalResin={dict.original_resin}
          />
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_3"
          classList={["flex", "justify-center"]}
        />
      </TooltipProvider>
    </div>
  );
}
