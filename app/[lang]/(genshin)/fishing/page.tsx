import type { Fish } from "@interfaces/genshin";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getRemoteData } from "@lib/localData";
import { i18n } from "i18n-config";
import { FishingPoint } from "interfaces/fishing";
import GenshinFishingList from "./list";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

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
    "fishing"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Cooking Recipes List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover all the cooking recipes and the best fishing to cook for your team.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/fishing`,
    locale,
  });
}

export default async function GenshinFishing({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "fishing"
  );

  const fishingPoints = await getRemoteData<Record<string, FishingPoint[]>>(
    "genshin",
    "fishing"
  );
  const allFish = await getGenshinData<Record<string, Fish>>({
    resource: "fish",
    language: langData,
    asMap: true,
  });

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "fishing", defaultMessage: "Fishing" })}
      </h2>
      <GenshinFishingList fish={allFish} fishingPoints={fishingPoints} />
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
